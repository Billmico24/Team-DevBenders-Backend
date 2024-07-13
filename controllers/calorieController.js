import { Product, User } from "../models/calorieModel.js";
import { httpError } from "../helpers/httpError.js";

// Function to calculate daily rate
const calculateDailyRate = ({ currentWeight, height, age, desiredWeight }) => {
  return Math.floor(
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 - 10 * (currentWeight - desiredWeight),
  );
};

// Function to get products not allowed based on blood type
const getNotAllowedProducts = async (bloodType) => {
  const blood = [null, false, false, false, false];
  blood[bloodType] = true;
  const products = await Product.find({
    groupBloodNotAllowed: { $all: [blood] },
  });
  return products;
};

// Function to generate not allowed products object
const notAllowedProductsObj = async (bloodType) => {
  const notAllowedProductsArray = await getNotAllowedProducts(bloodType);
  const arr = [];
  notAllowedProductsArray.forEach(({ title }) => arr.push(title.ua));
  let notAllowedProductsAll = [...new Set(arr)];
  let notAllowedProducts = [];
  const message = ['You can eat everything'];
  if (notAllowedProductsAll[0] === undefined) {
    notAllowedProducts = message;
  } else {
    do {
      const index = Math.floor(Math.random() * notAllowedProductsAll.length);
      if (notNotAllowedProducts.includes(notAllowedProductsAll[index]) || notNotAllowedProducts.includes('undefined')) {
        break;
      } else {
        notNotAllowedProducts.push(notAllowedProductsAll[index]);
      }
    } while (notNotAllowedProducts.length !== 5);
  }
  if (notAllowedProductsAll.length === 0) {
    notAllowedProductsAll = message;
  }
  const result = { notAllowedProductsAll, notNotAllowedProducts };
  return result;
};

// Function to get daily rate controller
const getDailyRateController = async (req, res) => {
  try {
    const dailyRate = await calculateDailyRate(req.body);
    const { notAllowedProducts } = await notAllowedProductsObj(req.body.bloodType);
    return res.status(200).json({ dailyRate, notAllowedProducts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Function to get daily rate user controller
const getDailyRateUserController = async (req, res) => {
  try {
    const { user } = req;
    const dailyRate = calculateDailyRate(user.userData);
    const { notAllowedProducts } = await notAllowedProductsObj(user.userData.bloodType);

    user.userData = {
      ...user.userData,
      dailyRate,
      notAllowedProducts,
    };

    await User.findByIdAndUpdate(user._id, user);
    return res.status(200).json({ data: user.userData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Function to get all products by query
const getAllProductsByQuery = async (req, res, next) => {
  try {
    const { query: { title, limit = 10 } } = req;
    const titleFromUrl = decodeURI(title).trim();
    let products = await Product.find({
      $or: [
        { $text: { $search: titleFromUrl } },
      ],
    }).limit(limit);
    
    if (products.length === 0) {
      products = await Product.find({
        $or: [
          { 'title.ua': { $regex: titleFromUrl, $options: 'i' } },
        ],
      }).limit(limit);
    }

    if (products.length === 0) {
      return next(httpError(404)); // Using httpError from existing module
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  getDailyRateController,
  getDailyRateUserController,
  getAllProductsByQuery,
  calculateDailyRate,
  getNotAllowedProducts,
  notAllowedProductsObj,
};
