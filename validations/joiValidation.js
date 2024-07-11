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
  username: Joi.string().required().messages({
    "any.required": "Missing required name field",
  }),
  email: Joi.string()
    //.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .email({ minDomainSegments: 2, tlds: { allow: false } }).required()
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
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .email({ minDomainSegments: 2, tlds: { allow: false } }).required()
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
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .email({ minDomainSegments: 2, tlds: { allow: false } }).required()
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
});

// Validation for Product

const searchProductValidation = Joi.object({
  name: Joi.string().required().min(1).max(50)  // Example: Ensure 'name' is a required string between 1 and 50 characters
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required',
      'string.min': 'Name must have at least {#limit} characters',
      'string.max': 'Name must have at most {#limit} characters'
    }),
});

const addProductValidation = Joi.object({
  productName: Joi.string().required().min(1).max(50).messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name cannot be empty',
    'any.required': 'Product name is required',
    'string.min': 'Product name must have at least {#limit} characters',
    'string.max': 'Product name must have at most {#limit} characters'
  }),
  productWeight: Joi.number().required().min(0).max(10000).messages({
    'number.base': 'Product weight must be a number',
    'number.empty': 'Product weight cannot be empty',
    'any.required': 'Product weight is required',
    'number.min': 'Product weight must be at least {#limit}',
    'number.max': 'Product weight must be at most {#limit}'
  }),
  date: Joi.date().required().iso().messages({
    'date.base': 'Date must be a valid date format',
    'date.empty': 'Date cannot be empty',
    'any.required': 'Date is required',
    'date.iso': 'Date must be in ISO format'
  })
});

const deleteProductValidation = Joi.object({
  productId: Joi.string().hex().length(24).required()
    .messages({
      'string.base': 'Product ID must be a string',
      'string.empty': 'Product ID cannot be empty',
      'any.required': 'Product ID is required',
      'string.length': 'Product ID must be exactly {#limit} characters',
      'string.hex': 'Product ID must be a hexadecimal',
    }),
});


// Export all validation schemas
export {
  specificDayValidation,
  signupValidation,
  loginValidation,
  emailValidation,
  addProductValidation,
  deleteProductValidation,
  searchProductValidation
};
