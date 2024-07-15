import Product from "../models/productModel.js";
import { httpError } from "../helpers/httpError.js";

const countCalories = async (productName, productWeight) => {
  try {
    const product = await Product.findOne({
      "title.ua": productName, //supposed to be english
    });

    if (!product) {
      throw httpError(404, "Product name is not correct");
    }

    const { calories, weight } = product;
    const productCalories = Math.round((calories / weight) * productWeight);

    return productCalories;
  } catch (error) {
    throw error; // Rethrow the error to be caught by the caller
  }
};

export default countCalories;