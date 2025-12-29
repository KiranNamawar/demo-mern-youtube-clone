import Video from "../models/Video.js";
import { ok } from "../utils/response.js";

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

    const videos = await Video.find(query)
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

export async function getCategories(req, res, next) {
  try {
    const categories = await Video.distinct("category");
    ok(res, "Categories list fetched successfully", categories, 200);
  } catch (err) {
    next(err);
  }
}
