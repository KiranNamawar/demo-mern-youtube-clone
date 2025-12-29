import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    videoId: { type: Schema.Types.ObjectId, ref: "Video" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true },
);

commentSchema.index({ videoId: 1, createdAt: -1 }); // Newest comments first

export default model("Comment", commentSchema);
