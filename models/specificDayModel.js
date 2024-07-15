import { Schema, model } from "mongoose";

const specificDaySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    kcal: { type: Number, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const SpecificDay = model("SpecificDay", specificDaySchema);

//export default SpecificDay;
export { SpecificDay };
