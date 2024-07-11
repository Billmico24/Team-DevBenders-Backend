import express from "express";
import {
  getDayInfo,
  addDayInfo,
  deleteDayInfo,
} from "../../controllers/specificDayController.js";

const router = express.Router();

router.get("/day-info/:date", getDayInfo); // <-- Ensures consistency with frontend

router.post("/day-info", addDayInfo);

router.delete("/day-info/:id", deleteDayInfo);

export default router;
