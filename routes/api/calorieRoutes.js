import express from 'express';
import { getPublicCalorieInfo, getPrivateCalorieInfo } from '../../controllers/calorieController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Public endpoint
router.get('/public-calorie-info', getPublicCalorieInfo);

// Private endpoint
router.post('/private-calorie-info', authMiddleware, getPrivateCalorieInfo);

export default router;
