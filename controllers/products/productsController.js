const { Product, User } = require('../../models');
const calculateDailyRate = require("./calculateDailyRate");
const notAllowedProductsObj = require("./notAllowedProductsObj");
const { createNotFoundError } = require("../../middlewares");

const getDailyRateController = async (req, res) => {
    const dailyRate = await calculateDailyRate(req.body);
    const { notAllowedProducts, notAllowedProductsAll } = await notAllowedProductsObj(req.body.bloodType);
    return res.status(200).json({ dailyRate, notAllowedProducts, notAllowedProductsAll, });
};

const getDailyRateUserController = async (req, res) => {
    const { user } = req;
    const dailyRate = await calculateDailyRate(user.infouser);
    const { notAllowedProducts, notAllowedProductsAll } = await notAllowedProductsObj(user.infouser.bloodType);
    user.infouser = {
        ...user.infouser,
        dailyRate,
        notAllowedProducts,
        notAllowedProductsAll,
    };
    await User.findByIdAndUpdate(user._id, user);
    return res.status(200).json({ data: user.infouser });
};

const getAllProductsByQuery = async (req, res, next) => {
  const { query: { title, limit = 10 } } = req;
  console.log("title: ", title)
  const titleFromUrl = decodeURI(title).trim();
  const products = await Product.find({
    $or: [
      { $text: { $search: titleFromUrl } },
    ],
  }).limit(limit);
  console.log(products);
  if (products.length === 0) {
    const newProducts = await Product.find({
      $or: [
        { 'title': { $regex: titleFromUrl, $options: 'i' } },
      ],
    }).limit(limit);

    if (newProducts.length === 0) {
      return next(createNotFoundError());
    }
    return res.status(200).json({ data: newProducts });
  }
  return res.status(200).json({ data: products });
};

module.exports = {
    getDailyRateController,
    getDailyRateUserController,
    getAllProductsByQuery,
};