import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  categories: [String],
  weight: Number,
  calories: Number,
  groupBloodNotAllowed: {
    0: {},
    1: Boolean,
    2: Boolean,
    3: Boolean,
    4: Boolean,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
