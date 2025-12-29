import { Router } from "express";
import { meHandler } from "./protected/me.js";

const router = Router();

router.get("/me", meHandler);

export default router;
