import { Schema, model } from "mongoose";

const channelSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    handle: { type: String, unique: true },
    name: String,
    description: String,
    banner: String,
    avatar: String,
    subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  },
  { timestamps: true }
);

channelSchema.index({ userId: 1 }); // User's channels
channelSchema.index({ name: "text" }); // search by name

export default model("Channel", channelSchema);
