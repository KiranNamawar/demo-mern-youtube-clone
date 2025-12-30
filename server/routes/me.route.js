import { Router } from "express";
import { User } from "../models/index.js";
import { ok } from "../utils/response.js";
import { authenticateUser } from "../middlewares/auth.js";

export async function getMyData(req, res, next) {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).lean();
    ok(
      res,
      "User data fetched Successfully",
      {
        id: user._id,
        email: user.email,
        avatar: user.avatar,
        username: user.username,
        channels: user.channels,
      },
      200
    );
  } catch (err) {
    next(err);
  }
}

const router = Router();

router.get("/", authenticateUser, getMyData);

export default router;
