import ErrorCodes from "../lib/error-codes.js";
import { validateDocumentId } from "../middlewares/validation.js";
import { Channel, User, Video } from "../models/index.js";
import { fail, ok } from "../utils/response.js";

export async function getChannelDetail(req, res, next) {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId)
      .populate({
        path: "videos",
        select:
          "title description videoUrl thumbnailUrl views createdAt category",
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
    await User.updateOne({ _id: userId }, { $push: { channels: channel._id } });

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

    // remove from user's channels array
    await User.updateOne({ _id: userId }, { $pull: { channels: channelId } });

    ok(res, "Channel deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
}

export async function isHandleAvailable(req, res, next) {
  try {
    const { handle } = req.params;
    const exists = await Channel.exists({ handle });
    if (exists) {
      return fail(res, ErrorCodes.CONFLICT, `${handle} already exists`, 409);
    }
    ok(res, `${handle} is available`, null, 200);
  } catch (err) {
    next(err);
  }
}

export async function createVideo(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;

    const channel = await Channel.findOne({ _id: channelId, userId });
    if (!channel) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "only channel owner can create video in their channel",
        401
      );
    }

    // create video
    const video = await Video.create({
      channelId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
    });

    // add video to channel's videos array
    channel.videos.push(video._id);
    await channel.save();

    ok(res, "Video created successfully", video, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateVideo(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId, videoId } = req.params;
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;

    const channel = await Channel.findOne({
      _id: channelId,
      userId,
      videos: videoId,
    }).lean();
    if (!channel) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "only channel owner can update video in their channel",
        401
      );
    }

    // update video
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        category,
      },
      { new: true }
    ).lean();

    ok(res, "Video updated successfully", video, 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteVideo(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId, videoId } = req.params;

    const channel = await Channel.findOne({
      _id: channelId,
      userId,
      videos: videoId,
    });
    if (!channel) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "only channel owner can delete video in their channel",
        401
      );
    }

    // delete video
    await Video.deleteOne({ _id: videoId });

    // remove video from channels videos array
    channel.videos.pull(videoId);
    await channel.save();

    ok(res, "Video deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
}

export async function subscribe(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    // add userId to channel's subscribers array
    await Channel.updateOne(
      { _id: channelId },
      { $push: { subscribers: userId } }
    );

    ok(res, "Subscribed to Channel successfully", null, 200);
  } catch (err) {
    next(err);
  }
}

export async function unsubscribe(req, res, next) {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    // remove userId from channel's subscribers array
    await Channel.updateOne(
      { _id: channelId },
      { $pull: { subscribers: userId } }
    );

    ok(res, "Unsubscribed to Channel successfully", null, 200);
  } catch (err) {
    next(err);
  }
}

export const validateChannelId = validateDocumentId(Channel, "channelId");
