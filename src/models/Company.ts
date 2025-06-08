// models/Company.ts

import mongoose, { Schema, model, models } from "mongoose";

const CompanySchema = new Schema({
  name: { type: String, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: "Project"
  }],
  subscriptionPlan: {
    type: Schema.Types.ObjectId,
    ref: "SubscriptionPlan"
  }
}, { timestamps: true });

export default models.Company || model("Company", CompanySchema);
