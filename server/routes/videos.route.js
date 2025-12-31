import { Router } from "express";
import z from "zod";
import {
  createComment,
  deleteComment,
  updateComment,
  validateCommentId,
} from "../controllers/comments.controller.js";
import {
  getCategories,
  getVideoById,
  getVideos,
  incrementVideoViews,
  updateVideoLikes,
  validateVideoId,
} from "../controllers/videos.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validation.js";

const commentSchema = z.object({
  content: z.string({ error: "content is required" }),
});

const router = Router();

// public videos routes
router.get("/categories", getCategories);
router.get("/", getVideos);
router.get("/:videoId", validateVideoId, getVideoById);
router.patch("/:videoId/views", validateVideoId, incrementVideoViews);

// protected videos routes
router.patch(
  "/:videoId/likes",
  authenticateUser,
  validateVideoId,
  updateVideoLikes
);

// video comments routes
router.post(
  "/:videoId/comments",
  authenticateUser,
  validateVideoId,
  validateBody(commentSchema),
  createComment
);
router.put(
  "/:videoId/comments/:commentId",
  authenticateUser,
  validateVideoId,
  validateCommentId,
  validateBody(commentSchema),
  updateComment
);
router.delete(
  "/:videoId/comments/:commentId",
  authenticateUser,
  validateVideoId,
  validateCommentId,
  deleteComment
);

export default router;
