import Joi from "joi";
import { Schema, model } from "mongoose";

import handleSaveErrors from "../helpers/handleSaveErrors.js";

const summarySchema = new Schema({
  date: String,
  kcalLeft: Number,
  kcalConsumed: Number,
  percentsOfDailyRate: Number,
  dailyRate: Number,
  userId: Schema.Types.ObjectId,
});

summarySchema.post("save", handleSaveErrors);

const Summary = model("summary", summarySchema);

export default Summary;
