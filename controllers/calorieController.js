import NonRecommendedFood from '../models/nonRecommendedFoodModel.js';
import UserCalorieIntake from '../models/userCalorieIntakeModel.js';

// Formula for calculating daily calorie norms for women
const calculateDailyCalories = (weight, height, age, desiredWeight) => {
  return 10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight);
};

const getPublicCalorieInfo = async (req, res) => {
  try {
    const nonRecommendedFoods = await NonRecommendedFood.find();
    res.json({ nonRecommendedFoods });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving non-recommended foods', error: error.message });
  }
};

const getPrivateCalorieInfo = async (req, res) => {
  const { userId } = req.user;
  const { weight, height, age, desiredWeight } = req.body;

  try {
    const dailyCalorieIntake = calculateDailyCalories(weight, height, age, desiredWeight);

    const userCalorieIntake = new UserCalorieIntake({
      userId,
      dailyCalorieIntake,
    });

    await userCalorieIntake.save();

    const nonRecommendedFoods = await NonRecommendedFood.find();

    res.json({ dailyCalorieIntake, nonRecommendedFoods });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating daily calorie intake', error: error.message });
  }
};

export { getPublicCalorieInfo, getPrivateCalorieInfo };
