import mongoose from 'mongoose';

const userCalorieIntakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dailyCalorieIntake: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserCalorieIntake = mongoose.model('UserCalorieIntake', userCalorieIntakeSchema);

export default UserCalorieIntake;
