import ErrorCodes from "../lib/error-codes.js";
import { validateDocumentId } from "../middlewares/validation.js";
import { Channel, User } from "../models/index.js";
import { fail, ok } from "../utils/response.js";

export async function getChannelDetail(req, res, next) {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId)
      .populate({
        path: "videos",
        select: "title thumbnailUrl views createdAt",
        options: {
          sort: { createdAt: -1 },
        },
      })
      .lean();
    if (!channel) {
      return fail(
        res,
        ErrorCodes.NOT_FOUND,
        `No Channel found with channelId: ${channelId}`,
        404
      );
    }

    channel.subscriberCount = channel.subscribers.length;
    delete channel.subscribers;

    ok(res, "Channel data fetched successfully", channel, 200);
  } catch (err) {
    next(err);
  }
}

export async function createChannel(req, res, next) {
  try {
    const userId = req.user.id;
    const { handle, name, description, banner, avatar } = req.body;

    // create channel
    const channel = await Channel.create({
      userId,
      name,
      handle,
      description,
      banner,
      avatar,
    });

    // add to user's channels array
    await User.updateOne({ userId }, { $push: { channels: channel._id } });

    ok(res, "Channel created successfully", channel, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateChannel(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;
    const { handle, name, description, banner, avatar } = req.body;

    // update channel - user can only update their channel
    const channel = await Channel.findOneAndUpdate(
      { _id: channelId, userId },
      {
        handle,
        name,
        description,
        banner,
        avatar,
      },
      { new: true }
    ).lean();

    if (!channel) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "User can only update their own channels",
        401
      );
    }

    ok(res, "Channel updated successfully", channel, 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteChannel(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    // delete channel - user can only update their channel
    const result = await Channel.deleteOne({ _id: channelId, userId });

    if (result.deletedCount === 0) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "Users can only delete their own channels",
        401
      );
    }

    ok(res, "Channel deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
}

export async function isHandleAvailable(req, res, next) {
  try {
    const { handle } = req.body;
    const exists = await Channel.exists({ handle });
    if (exists) {
      return fail(res, ErrorCodes.CONFLICT, `${handle} already exists`, 409);
    }
    ok(res, `${handle} is available`, null, 200);
  } catch (err) {
    next(err);
  }
}

export const validateChannelId = validateDocumentId(Channel, "channelId");
