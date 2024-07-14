import Joi from "joi";
import { Schema, model } from "mongoose";

import handleSaveErrors from "../helpers/handleSaveErrors.js";

const sessionSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

sessionSchema.post("save", handleSaveErrors);

const addSessionSchema = Joi.object({
  uid: Joi.string().required(),
});

const schemas = {
  addSessionSchema,
};

const Session = model("session", sessionSchema);

export { Session, schemas };
