import Joi from "joi";
import { Schema, model } from "mongoose";

import handleSaveErrors from "../helpers/handleSaveErrors.js";

const productSchema = new Schema(
  {
    weight: Number,
    title: { ua: String },
    calories: Number,
    groupBloodNotAllowed: {
      0: {},
      1: Boolean,
      2: Boolean,
      3: Boolean,
      4: Boolean,
    },
    userId: Schema.Types.ObjectId,
  },
  { minimize: false }
);

productSchema.post("save", handleSaveErrors);

const Product = model("product", productSchema);

const addNewProduct = Joi.object({
  weight: Joi.number().required(),
  title: Joi.object({
    ua: Joi.string().required(),
  }).required(),
  calories: Joi.string().required(),
  groupBloodNotAllowed: Joi.object({
    0: Joi.any().allow(null),
    1: Joi.boolean().required(),
    2: Joi.boolean().required(),
    3: Joi.boolean().required(),
    4: Joi.boolean().required(),
  }).required(),
  userId: Schema.Types.ObjectId,
});

export { Product, addNewProduct };
