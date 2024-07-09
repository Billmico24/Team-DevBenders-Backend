import NonRecommendedFood from "../models/nonRecommendedFoodModel.js";
import UserCalorieIntake from "../models/userCalorieIntakeModel.js";

const calculateDailyCalories = (weight, height, age, desiredWeight) => {
  return 10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight);
};

const getPublicCalorieInfo = async (_req, res) => {
  try {
    // Fetch non-recommended foods
    const nonRecommendedFoods = await NonRecommendedFood.find();
    res.json({ nonRecommendedFoods });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving non-recommended foods", error: error.message });
  }
};

const getPrivateCalorieInfo = async (req, res) => {
  const { userId } = req.user;
  const { weight, height, age, desiredWeight } = req.body;

  try {
    // Calculate daily calorie intake
    const dailyCalorieIntake = calculateDailyCalories(weight, height, age, desiredWeight);

    // Save user calorie intake
    const userCalorieIntake = new UserCalorieIntake({
      userId,
      dailyCalorieIntake,
    });
    await userCalorieIntake.save();

    // Fetch non-recommended foods
    const nonRecommendedFoods = await NonRecommendedFood.find();

    res.json({ dailyCalorieIntake, nonRecommendedFoods });
  } catch (error) {
    res.status(500).json({ message: "Error calculating daily calorie intake", error: error.message });
  }
};

export { getPublicCalorieInfo, getPrivateCalorieInfo };
