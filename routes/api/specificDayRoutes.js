import express from "express";
import {
  getDayInfo,
  addDayInfo,
  deleteDayInfo,
} from "../../controllers/specificDayController.js";

const router = express.Router();

// daily-rate
console.log('sulod specificDayRoutes');

router.get("/info/:date", getDayInfo); // <-- Ensures consistency with frontend
router.post("/info", addDayInfo);
router.delete("/info/:id", deleteDayInfo);

export { router as specificDayRouter};
