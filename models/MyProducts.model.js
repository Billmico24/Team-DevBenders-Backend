const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  productInfo: [
    {
      productWeight: {
        type: String,
      },
      productCalories: {
        type: String,
      },
      productName: {
        type: String,
        required: [true, "productName is required"],
      },
    },
  ],
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

const MyProducts = model("myproducts", productSchema);

module.exports = { MyProducts };
