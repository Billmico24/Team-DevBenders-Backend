import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
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
    userData: {
        weight: {
          type: Number,
          default: 0
        },
        height: {
          type: Number,
          default: 0
        },
        age: {
          type: Number,
          default: 0
        },
        bloodType: {
          type: Number,
          default: null
        },
        desiredWeight: {
          type: Number,
          default: 0
        },
        dailyRate: {
          type: Number,
          default: 0
        },
        notAllowedProducts: {
          type: [String],
          default: null
        }, 
        notAllowedProductsAll: {
          type: [String],
          default: null
        }, 
      },
    days: [{ type: Schema.Types.ObjectId, ref: "Day" }],
  },
  
  { versionKey: false }
);

const User = model("user", userSchema);

export { User };