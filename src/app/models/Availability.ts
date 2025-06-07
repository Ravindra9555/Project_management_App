import mongoose, { Schema, model, models } from "mongoose";

const dailyAvailabilitySchema = new Schema({
  day: {
    type: String,
    enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  },
  hoursAvailable: {
    type: Number,
    default: 0
  }
}, { _id: false });

const availabilitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  weeklyAvailability: [dailyAvailabilitySchema],
}, { timestamps: true });

export default models.Availability || model("Availability", availabilitySchema);
