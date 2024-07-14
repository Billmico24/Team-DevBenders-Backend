import Joi from "joi";
import { Schema, model } from "mongoose";

import handleSaveErrors from "../helpers/handleSaveErrors.js";

const emailRegexp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User Name is required"],
      minlength: 2,
      maxLength: 25,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    passwordHash: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    userData: {
      weight: Number,
      height: Number,
      age: Number,
      bloodType: Number,
      desiredWeight: Number,
      dailyRate: Number,
      notAllowedProducts: [String],
    },
    days: [{ type: Schema.Types.ObjectId, ref: "Day" }],
  },
  { minimize: false }
);

userSchema.post("save", handleSaveErrors);

const User = model("user", userSchema);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  sid: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};

export { User, schemas };
