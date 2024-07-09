import express from 'express';
import { check } from 'express-validator';
import { getPublicCalorieInfo, getPrivateCalorieInfo } from '../../controllers/calorieController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';


const router = express.Router();

// Public endpoint
router.get('/public-calorie-info', getPublicCalorieInfo);

// Private endpoint
router.post(
    '/private-calorie-info',
    [
      authMiddleware,
      check('weight').isNumeric().withMessage('Weight must be a number'),
      check('height').isNumeric().withMessage('Height must be a number'),
      check('age').isNumeric().withMessage('Age must be a number'),
      check('desiredWeight').isNumeric().withMessage('Desired weight must be a number')
    ],
    getPrivateCalorieInfo
  );
  

export default router;
