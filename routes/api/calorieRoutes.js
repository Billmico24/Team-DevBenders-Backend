import express from 'express';
import {
  getDailyRateController,
  getDailyRateUserController,
  getAllProductsByQuery,
} from '../../controllers/calorieController.js';

const router = express.Router();

// Route to calculate daily rate
router.post('/daily-rate', async (req, res) => {
  try {
    const result = await getDailyRateController(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to calculate daily rate for user
router.post('/user-daily-rate', async (req, res) => {
  try {
    const result = await getDailyRateUserController(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get products by query
router.get('/products', async (req, res) => {
  try {
    const result = await getAllProductsByQuery(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

