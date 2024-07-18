import { Schema, model } from "mongoose";

const specificDaySchema = new Schema(
  {
    date: { type: Date, required: false,},
    title: { type: String, required: false },
    weight: { type: Number, required: false },
    kcal: { type: Number, required: false },
    id: String,
    _id: false,
  },
  { timestamps: true }
);

const SpecificDay = model("SpecificDay", specificDaySchema);

//export default SpecificDay;
export { SpecificDay };
