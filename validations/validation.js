import Joi from "joi";

// validation for signup
const signupValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "any.required": "Missing required name field",
    }),
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

const loginValidation = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
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

// validation for email
const emailValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
});

// prettier-ignore
export { signupValidation, loginValidation, emailValidation };