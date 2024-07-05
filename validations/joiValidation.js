import Joi from "joi";

// Validation for specific day
const specificDayValidation = Joi.object({
  date: Joi.string().required().messages({
    "any.required": "Date is required"
  }),
  title: Joi.string().required().messages({
    "any.required": "Title is required"
  }),
  weight: Joi.number().required().messages({
    "any.required": "Weight is required"
  }),
});

// Validation for signup
const signupValidation = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Missing required name field",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
  password: Joi.string().min(6).max(16).required().messages({
    "any.required": "Missing required password field",
    "string.min": "Password must be at least {#limit} characters long",
    "string.max": "Password cannot be longer than {#limit} characters",
  }),
});

// Validation for login
const loginValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
  password: Joi.string().min(6).max(16).required().messages({
    "any.required": "Missing required password field",
    "string.min": "Password must be at least {#limit} characters long",
    "string.max": "Password cannot be longer than {#limit} characters",
  }),
});

// Validation for email
const emailValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
});

// Export all validation schemas
export {
  specificDayValidation,
  signupValidation,
  loginValidation,
  emailValidation,
};
