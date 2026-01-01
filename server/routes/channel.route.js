import { Router } from "express";
import z from "zod";
import {
  createChannel,
  createVideo,
  deleteChannel,
  deleteVideo,
  getChannelDetail,
  isHandleAvailable,
  subscribe,
  unsubscribe,
  updateChannel,
  updateVideo,
  validateChannelId,
} from "../controllers/channel.controller.js";
import { validateVideoId } from "../controllers/videos.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validation.js";

const channelSchema = z.object({
  handle: z
    .string({ error: "handle is required" })
    .min(3, { error: "handle must be at least 3 characters" })
    .max(30, { error: "handle too long" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Only letters, numbers, _, - allowed",
    }),
  name: z.string({ error: "name is required" }),
  description: z.string().optional(),
  banner: z.url({ error: "Invalid banner image url" }).optional(),
  avatar: z.url({ error: "Invalid avatar image url" }).optional(),
});

const videoSchema = z.object({
  title: z.string({ error: "title is required" }),
  description: z.string().optional(),
  videoUrl: z.url({ error: "Invalid video url" }),
  thumbnailUrl: z.url({ error: "Invalid thumbnail url" }),
  category: z.string({ error: "category is required" }),
});

const router = Router();

// public channel routes
router.get("/:channelId", validateChannelId, getChannelDetail);
router.get("/check-handle/:handle", isHandleAvailable);

// protected channel routes
router.patch(
  "/:channelId/subscribe",
  authenticateUser,
  validateChannelId,
  subscribe
);
router.patch(
  "/:channelId/unsubscribe",
  authenticateUser,
  validateChannelId,
  unsubscribe
);

router.post("/", authenticateUser, validateBody(channelSchema), createChannel);
router.put(
  "/:channelId",
  authenticateUser,
  validateChannelId,
  validateBody(channelSchema),
  updateChannel
);
router.delete(
  "/:channelId",
  authenticateUser,
  validateChannelId,
  deleteChannel
);

// channel videos routes
router.post(
  "/:channelId/video",
  authenticateUser,
  validateChannelId,
  validateBody(videoSchema),
  createVideo
);
router.put(
  "/:channelId/video/:videoId",
  authenticateUser,
  validateChannelId,
  validateVideoId,
  validateBody(videoSchema),
  updateVideo
);
router.delete(
  "/:channelId/video/:videoId",
  authenticateUser,
  validateChannelId,
  validateVideoId,
  deleteVideo
);

export default router;
