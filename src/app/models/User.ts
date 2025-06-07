import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // if not using OAuth
  role: {
    type: String,
    enum: ["admin", "engineer", "worker", "client"],
    default: "engineer",
  },
  profilePic: { type: String },
  isActive: { type: Boolean, default: true },
  subscriptionPlan: {
    type: Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
  },
}, { timestamps: true });


export default models.User || model("User", userSchema);
