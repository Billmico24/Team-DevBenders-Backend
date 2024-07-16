const Joi = require("joi").extend(require("@joi/date"));

const joiGetDailyRateSchema = Joi.object({
  currentWeight: Joi.number().required(),
  height: Joi.number().required(),
  age: Joi.number().required(),
  desiredWeight: Joi.number().required(),
  bloodType: Joi.number().required(),
});

const joiUpdateDailyRateSchema = Joi.object({
  currentWeight: Joi.number().required(),
  height: Joi.number().required(),
  age: Joi.number().required(),
  desiredWeight: Joi.number().required(),
  bloodType: Joi.number().required(),
  dailyRate: Joi.number().required(),
  notAllowedProducts: Joi.array().items(Joi.string()),
  notAllowedProductsAll: Joi.array().items(Joi.string()),
});

const joiSignupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string(),
  currentWeight: Joi.number(),
  height: Joi.number(),
  age: Joi.number(),
  desiredWeight: Joi.number(),
  bloodType: Joi.number(),
  dailyRate: Joi.number(),
  notAllowedProducts: Joi.array().items(Joi.string()),
  notAllowedProductsAll: Joi.array().items(Joi.string()),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().required(), 
  password: Joi.string().min(6).required(),
});

const joiAddMyProductSchema = Joi.object({
  productName: Joi.string().required(),
  productWeight: Joi.number().integer().min(5).max(5000).required(),
  date: Joi.date().format("DD.MM.YYYY").required(),
});

const joiDeleteMyProductSchema = Joi.object({
  date: Joi.date().format("DD.MM.YYYY").required(),
});

const joiGetMyProductSchema = Joi.object({
  date: Joi.date().format("DD.MM.YYYY").required(),
});

module.exports = {
  joiGetDailyRateSchema,
  joiUpdateDailyRateSchema,
  joiSignupSchema,
  joiLoginSchema,
  joiAddMyProductSchema,
  joiDeleteMyProductSchema,
  joiGetMyProductSchema,
};
