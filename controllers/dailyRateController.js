import { Product } from "../models/productModel.js";
import { User } from "../models/usersModel.js";
import { Summary } from "../models/summaryModel.js";

const countDailyRate = async (req, res) => {
  const { height, weight, age, desiredWeight, bloodType } = req.body;

  console.log('req.body',req.body);
  // const { _id } = req.params;
  // const userId = _id;

  const { userId } = req.params;

  // const dailyRate = 10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight);
  console.log('height', height);
  console.log('weight', weight);
  console.log('age', age);
  console.log('desiredWeight', desiredWeight);
  console.log('bloodType',bloodType);

  const dailyRate =
    10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight);

  // const dailyRate = 1040; 

  console.log('dailyRate', dailyRate);

  let notAllowedProductsObj = [];
  switch (bloodType) {
    case 1:
      notAllowedProductsObj = await Product.find({
        "groupBloodNotAllowed.1": true,
      }).lean();
      break;
    case 2:
      notAllowedProductsObj = await Product.find({
        "groupBloodNotAllowed.2": true,
      }).lean();
      break;
    case 3:
      notAllowedProductsObj = await Product.find({
        "groupBloodNotAllowed.3": true,
      }).lean();
      break;
    case 4:
      notAllowedProductsObj = await Product.find({
        "groupBloodNotAllowed.4": true,
      }).lean();
      break;
    default:
      break;
  }
  const notAllowedProducts = [
      ...new Set(notAllowedProductsObj.map((product) => product.title)),
    ];
    if (userId) {
      console.log('userId',userId);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "Invalid user" });
      }
      console.log('dailyRate',dailyRate);
      user.userData = {
        weight,
        height,
        age,
        bloodType,
        desiredWeight,
        dailyRate,
        notAllowedProducts,
      };
      await user.save();
      let summariesToUpdate = await Summary.find({ userId });
      if (summariesToUpdate) {
        summariesToUpdate.forEach((summary) => {
          if (summary.dailyRate > dailyRate) {
            const diff = summary.dailyRate - dailyRate;
            summary.dailyRate = dailyRate;
            summary.kcalLeft -= diff;
            summary.percentsOfDailyRate =
              (summary.kcalConsumed * 100) / dailyRate;
          }
          if (summary.dailyRate < dailyRate) {
            const diff = dailyRate - summary.dailyRate;
            summary.dailyRate = dailyRate;
            summary.kcalLeft += diff;
            summary.percentsOfDailyRate =
              (summary.kcalConsumed * 100) / dailyRate;
          }
          summary.save();
        });
      } else {
        summariesToUpdate = [];
      }
      return res.status(201).send({
        dailyRate,
        summaries: summariesToUpdate,
        id: user._id,
        notAllowedProducts,
      });
    }
    return res.status(200).send({ dailyRate, notAllowedProducts });

};

export { countDailyRate };