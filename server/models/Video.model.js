import { Schema, model } from "mongoose";

const videoSchema = new Schema(
  {
    channelId: { type: Schema.Types.ObjectId, ref: "Channel" },
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    views: { type: Number, min: 0 },
    likes: { type: Number, min: 0 },
    category: String,
  },
  { timestamps: true }
);

videoSchema.index({ channelId: 1, createdAt: -1 }); // Channel Videos (newest first)
videoSchema.index({ category: 1 }); // filter by category
videoSchema.index({ title: "text" }); // search by title
videoSchema.index({ createdAt: -1 }); // Home page feed (newest first)

export default model("Video", videoSchema);
