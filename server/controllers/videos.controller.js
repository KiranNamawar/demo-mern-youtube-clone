import ErrorCodes from "../lib/error-codes.js";
import { validateDocumentId } from "../middlewares/validation.js";
import { Comment, Video } from "../models/index.js";
import { fail, ok } from "../utils/response.js";

export async function getCategories(req, res, next) {
  try {
    const categories = await Video.distinct("category");
    ok(res, "Categories list fetched successfully", categories, 200);
  } catch (err) {
    next(err);
  }
}

export async function getVideos(req, res, next) {
  try {
    const { search, category, limit, offset } = req.query ?? {};

    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }

    const videos = await Video.find(query, {
      title: true,
      thumbnailUrl: true,
      views: true,
      channelId: true,
      createdAt: true,
    })
      .populate("channelId", "name avatar")
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean();

    ok(res, "Videos fetched Successfully", videos, 200);
  } catch (err) {
    next(err);
  }
}

export async function getVideoById(req, res, next) {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId)
      .populate("channelId", "name avatar subscribers")
      .lean();
    if (!video) {
      return fail(
        res,
        ErrorCodes.NOT_FOUND,
        `No video found with videoId: ${videoId}`,
        404
      );
    }

    // Calculate count and remove the array of IDs
    video.channelId.subscribersCount = video.channelId.subscribers?.length || 0;
    video.channelId.subscribed = req.user
      ? video.channelId.subscribers.includes(req.user.id)
      : false;

    delete video.channelId.subscribers;

    const comments = await Comment.find({ videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 })
      .lean();

    const relatedVideos = await Video.find(
      { category: video.category },
      {
        title: true,
        thumbnailUrl: true,
        views: true,
        channelId: true,
        createdAt: true,
      }
    )
      .populate("channelId", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    ok(
      res,
      "Video fetched successfully",
      { ...video, comments, relatedVideos },
      200
    );
  } catch (err) {
    next(err);
  }
}

function updateVideoFieldCount(field) {
  return async (req, res, next) => {
    const updateBy = req.query.dec === "true" ? -1 : 1;
    try {
      const { videoId } = req.params;
      const video = await Video.findOneAndUpdate(
        { _id: videoId, [field]: { $gte: updateBy === -1 ? 1 : 0 } },
        { $inc: { [field]: updateBy } },
        { new: true }
      )
        .select(field)
        .lean();

      if (!video) {
        return fail(
          res,
          ErrorCodes.NOT_FOUND,
          `No video found with videoId: ${videoId}`,
          404
        );
      }

      ok(
        res,
        `Video ${field} ${
          updateBy === 1 ? "Incremented" : "Decremented"
        } Successfully`,
        {
          [field]: video[field],
          videoId: video._id,
        },
        200
      );
    } catch (err) {
      next(err);
    }
  };
}

export const incrementVideoViews = updateVideoFieldCount("views");
export const updateVideoLikes = updateVideoFieldCount("likes");

export const validateVideoId = validateDocumentId(Video, "videoId");
