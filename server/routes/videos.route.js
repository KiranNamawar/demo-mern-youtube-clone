import { Router } from "express";
import {
  getCategories,
  getVideos,
  getVideoById,
  incrementVideoViews,
  updateVideoLikes,
} from "../controllers/videos.controller.js";
import { validateObjectId } from "../middlewares/validation.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = Router();

// public videos routes
router.get("/categories", getCategories);
router.get("/", getVideos);
router.get("/:videoId", validateObjectId("videoId"), getVideoById);
router.patch(
  "/:videoId/views",
  validateObjectId("videoId"),
  incrementVideoViews
);

// protected videos routes
router.patch(
  "/:videoId/likes",
  authenticateUser,
  validateObjectId("videoId"),
  updateVideoLikes
);

export default router;
