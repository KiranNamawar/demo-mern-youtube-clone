import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { Channel, User } from "../models/index.js";
import { ok } from "../utils/response.js";

export async function getMyData(req, res, next) {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "channels",
        select: "name avatar createdAt",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
    const subscriptions = await Channel.find({ subscribers: userId })
      .select("name avatar")
      .lean();

    ok(
      res,
      "User data fetched Successfully",
      {
        id: user._id,
        email: user.email,
        avatar: user.avatar,
        username: user.username,
        channels: user.channels,
        subscriptions,
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
