import mongoose from 'mongoose';

const nonRecommendedFoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
});

const NonRecommendedFood = mongoose.model('NonRecommendedFood', nonRecommendedFoodSchema);

export default NonRecommendedFood;
