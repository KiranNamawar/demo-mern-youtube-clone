import { Router } from "express";
import z from "zod";
import {
  createChannel,
  deleteChannel,
  getChannelDetail,
  isHandleAvailable,
  updateChannel,
  validateChannelId,
} from "../controllers/channel.controller.js";
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

const handleSchema = z.object({
  handle: z
    .string({ error: "handle is required" })
    .min(3, { error: "handle must be at least 3 characters" })
    .max(30, { error: "handle too long" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Only letters, numbers, _, - allowed",
    }),
});

const router = Router();

// public channel routes
router.get("/:channelId", validateChannelId, getChannelDetail);
router.post("/check-handle", validateBody(handleSchema), isHandleAvailable);

// protected channel routes
router.post("/", authenticateUser, validateBody(channelSchema), createChannel);
router.put(
  "/:channelId",
  validateChannelId,
  authenticateUser,
  validateBody(channelSchema),
  updateChannel
);
router.delete(
  "/:channelId",
  validateChannelId,
  authenticateUser,
  deleteChannel
);

export default router;
