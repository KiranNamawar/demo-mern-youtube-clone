import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

commentSchema.index({ videoId: 1, createdAt: -1 }); // Newest comments first

export default model("Comment", commentSchema);
