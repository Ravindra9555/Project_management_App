import  { Schema, model, models } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "on-hold", "back-log"],
      default: "not-started",
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    deadline: Date,
  },
  { timestamps: true }
);

export default models.Project || model("Project", projectSchema);
