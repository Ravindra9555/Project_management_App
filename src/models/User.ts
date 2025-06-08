import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: { type: String, },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // if not using OAuth

  accountType: {
    type: String,
    enum: ["individual", "organization"],
    default: "individual",
  },

  role: {
    type: String,
    enum: ["admin", "engineer", "worker", "client"],
    default: null,
  },

  profilePic: { type: String },
  isActive: { type: Boolean, default: true },

  subscriptionPlan: {
    type: Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
    default: null,
  },

  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
}, { timestamps: true });

export default models.User || model("User", userSchema);
