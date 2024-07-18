import mongoose from "mongoose";

const { Schema } = mongoose;

const summarySchema = new Schema({
  date: String,
  kcalLeft: Number,
  kcalConsumed: Number,
  percentsOfDailyRate: Number,
  dailyRate: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Summary = mongoose.model("Summary", summarySchema);

export { Summary };


