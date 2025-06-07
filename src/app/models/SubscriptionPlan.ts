import mongoose, { Schema, model, models } from "mongoose";

const subscriptionPlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free",
  },
  projectLimit: { type: Number, default: 5 },
  userLimit: { type: Number, default: 5 },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
}, { timestamps: true });

export default models.SubscriptionPlan || model("SubscriptionPlan", subscriptionPlanSchema);
