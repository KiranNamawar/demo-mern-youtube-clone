import { Router } from "express";
import { getCategories, getVideos } from "../controllers/videos.controller.js";

const router = Router();

// public videos routes
router.get("/", getVideos);
router.get("/categories", getCategories);

export default router;
