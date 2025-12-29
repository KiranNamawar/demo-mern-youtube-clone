import User from "../../models/User.js";
import { ok } from "../../utils/response.js";

export async function meHandler(req, res, next) {
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
