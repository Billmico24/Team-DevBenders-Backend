const {Schema, model} = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = Schema({
  name: {
    type: String,
    required: [true, 'Please set Name'],
  },
  email: {
    type: String,
    required: [true, 'Please set Email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please set Password'],
    minlength: 6
  },
  token: {
    type: String,
    default: null
  },
  phone: {
    type: String,
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
}, {versionKey: false, timestamps: true});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model("users", userSchema);

module.exports = {
  User,
};