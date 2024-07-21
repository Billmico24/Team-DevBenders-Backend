const validation = require("./validation");
const ctrlWrapper = require("./ctrlWrapper");
const auth = require("./auth");
const createNotFoundError = require("./createNotFoundError");
const {
  joiGetDailyRateSchema,
  joiUpdateDailyRateSchema,
  joiSignupSchema,
  joiLoginSchema,
  joiAddMyProductSchema,
  joiDeleteMyProductSchema,
  joiGetMyProductSchema,
} = require("./validationSchemas");

module.exports = {
  validation,
  ctrlWrapper,
  auth,
  createNotFoundError,
  joiGetDailyRateSchema,
  joiUpdateDailyRateSchema,
  joiSignupSchema,
  joiLoginSchema,
  joiAddMyProductSchema,
  joiDeleteMyProductSchema,
  joiGetMyProductSchema,
};
