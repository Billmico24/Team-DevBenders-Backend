import { Schema, model } from "mongoose";

const productSchema = new Schema({
  categories: {
    type: Array,
  },
  weight: {
    type: Number,
  },
  title: {
    type: Object,
  },
  calories: {
    type: Number,
  },
  groupBloodNotAllowed: {
    type: Array,
  },
});

const Product = model("product", productSchema);

export default Product;
