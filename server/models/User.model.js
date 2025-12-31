import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: String,
    channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

export default model("User", userSchema);
