import mongoose, { Schema, model, models } from "mongoose";

const progressLogSchema = new Schema({
  message: String,
  status: {
    type: String,
    enum: ["todo", "in-progress", "review", "done"],
    default: "todo"
  },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "review", "done"],
    default: "todo",
  },
  eta: Date,
  audioNoteUrl: String,
  progressLogs: [progressLogSchema],
}, { timestamps: true });

export default models.Task || model("Task", taskSchema);

