import Joi from "joi";

const getDailyRateSchema = Joi.object({
  weight: Joi.number().required().min(20).max(500),
  height: Joi.number().required().min(100).max(250),
  age: Joi.number().required().min(18).max(100),
  desiredWeight: Joi.number().required().min(20).max(500),
  bloodType: Joi.number().required().valid(1, 2, 3, 4),
});

export default getDailyRateSchema;
