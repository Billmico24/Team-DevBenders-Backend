import Product from "../models/productModel.js";
import countCalories from "../helpers/countCalories.js";
import { searchProductValidation, addProductValidation, deleteProductValidation } from "../validations/joiValidation.js";


const addProduct = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { productName, productWeight, date } = req.body;

    // Validate incoming data using Joi schema
    const { error } = addProductValidation.validate({
      productName,
      productWeight,
      date,
    });

    // Check for validation errors
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { productCalories } = await countCalories(productName, productWeight);

    // Check if the product already exists for the user on the given date
    const existingProduct = await Product.findOne({
      date,
      owner: _id,
      'productInfo.productName': productName,
    });

    if (existingProduct) {
      // Update existing product details
      const updatedProduct = await Product.findOneAndUpdate(
        {
          date,
          owner: _id,
          'productInfo.productName': productName,
        },
        {
          $set: {
            'productInfo.$.productWeight': Number(existingProduct.productInfo[0].productWeight) + Number(productWeight),
            'productInfo.$.productCalories': Number(existingProduct.productInfo[0].productCalories) + Number(productCalories),
          },
        },
        { new: true }
      );

      return res.status(200).json({
        success: 'success',
        code: 200,
        updatedProduct,
      });
    }

    // If no existing product, create a new one
    const newProduct = await Product.findOneAndUpdate(
      { date, owner: _id },
      {
        $push: {
          productInfo: {
            productCalories,
            productName,
            productWeight,
          },
        },
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: 'success',
      code: 201,
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    // Validate the 'name' query parameter using Joi
    const { error, value } = searchProductValidation.validate(req.query);

    // Check for validation errors
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Destructure the validated 'value' object to get the 'name' parameter
    const { name } = value;

    // Log the search query for debugging
    console.log(`Searching for products with name: ${name}`);

    // Search products by name using regex
    const products = await Product.find({ name: { $regex: name, $options: "i" } });

    // Respond with the found products
    res.json({ products });
  } catch (error) {
    // Pass any caught errors to the Express error handling middleware
    next(error);
  }
};
 
const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

     // Validate product ID
     const { error } = deleteProductValidation.validate({ productId });

     if (error) {
       return res.status(400).json({ message: error.message });
     }
    
    // Delete product by ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { searchProducts, addProduct, deleteProduct };
