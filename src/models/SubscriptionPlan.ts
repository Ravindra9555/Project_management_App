import mongoose, { Schema, model, models } from "mongoose";

const subscriptionPlanSchema = new Schema({
  ownerType: {
    type: String,
    enum: ["user", "company"], // "user" for individual, "company" for orgs
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    default: null,
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
