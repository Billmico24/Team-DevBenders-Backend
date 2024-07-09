import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
        type: String,
        required: [true, "Name is required"],
      },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
      },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatarURL: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    infouser: {
        currentWeight: {
          type: Number,
          default: null
        },
        height: {
          type: Number,
          default: null
        },
        age: {
          type: Number,
          default: null
        },
        desiredWeight: {
          type: Number,
          default: null
        },
        bloodType: {
          type: Number,
          default: null
        }, 
        dailyRate: {
          type: Number,
          default: null
        },
        notAllowedProducts: {
          type: [String],
          default: null
        }, 
        notAllowedProductsAll: {
          type: [String],
          default: null
        }, 
      }
  },
  { versionKey: false }
);

const User = model("user", userSchema);

export { User };