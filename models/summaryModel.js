import mongoose from "mongoose";

const { Schema } = mongoose;

const summarySchema = new Schema({
  date: String,
  kcalLeft: Number,
  kcalConsumed: Number,
  percentsOfDailyRate: Number,
  dailyRate: Number,
  userId: mongoose.Types.ObjectId,
});

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
