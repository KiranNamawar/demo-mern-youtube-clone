import { Schema, model } from "mongoose";

const channelSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    handle: { type: String, unique: true, required: true },
    name: { type: String, required: true },
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
