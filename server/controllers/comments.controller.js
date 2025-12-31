import ErrorCodes from "../lib/error-codes.js";
import { validateDocumentId } from "../middlewares/validation.js";
import { Comment } from "../models/index.js";
import { fail, ok } from "../utils/response.js";

function getVideoComments(videoId) {
  return Comment.find({ videoId })
    .populate("userId", "username avatar")
    .sort({ createdAt: -1 })
    .lean();
}

export async function createComment(req, res, next) {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;
    const { content } = req.body;

    await Comment.create({ userId, videoId, content });

    const comments = await getVideoComments(videoId);

    ok(res, "Comment Created Successfully", comments, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateComment(req, res, next) {
  try {
    const userId = req.user.id;
    const { videoId, commentId } = req.params;
    const { content } = req.body;

    // users can only update their comments
    const result = await Comment.updateOne(
      { _id: commentId, userId, videoId },
      { content }
    );
    if (result.matchedCount === 0) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "Users can only update comments they authored",
        401
      );
    }

    const comments = await getVideoComments(videoId);

    ok(res, "Comment updated successfully", comments, 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const userId = req.user.id;
    const { videoId, commentId } = req.params;

    // users can only delete their comments
    const result = await Comment.deleteOne({ _id: commentId, userId, videoId });
    if (result.deletedCount === 0) {
      return fail(
        res,
        ErrorCodes.UNAUTHORIZED,
        "Users can only delete comments they authored",
        401
      );
    }

    const comments = await getVideoComments(videoId);

    ok(res, "Comment deleted successfully", comments, 200);
  } catch (err) {
    next(err);
  }
}

export const validateCommentId = validateDocumentId(Comment, "commentId");
