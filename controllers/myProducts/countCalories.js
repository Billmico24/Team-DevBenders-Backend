const { Product } = require('../../models');
const { NotFound } = require('http-errors');

const countCalories = async (productName, productWeight) => {
  const product = await Product.findOne({ title: productName });

  if (!product) {
    NotFound('Product name is not correct');
  }

  const { calories, weight } = product;
  const productCalories = Math.round((calories / weight) * productWeight);

  return productCalories;
};

module.exports = countCalories;
