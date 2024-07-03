/**
 * @swagger
 * tags:
 *   name: Specific Day
 *   description: Operations related to specific day information
 */

import express from "express";
import {
  getDayInfo,
  addDayInfo,
  deleteDayInfo,
} from "../../controllers/specificDayController.js";
import authMiddleware from "../../middlewares/authMiddleware.js"; // Middleware for authentication

const router = express.Router();

/**
 * @swagger
 * /day-info/{date}:
 *   get:
 *     summary: Retrieve information for a specific day
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2023-06-26"
 *                 title:
 *                   type: string
 *                   example: "Sample Day"
 *                 weight:
 *                   type: number
 *                   example: 70
 *                 kcal:
 *                   type: number
 *                   example: 2000
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   example: "60b8d6e75b4b1e001c8d4a3e"
 */
router.get("/day-info/:date", authMiddleware, getDayInfo);

/**
 * @swagger
 * /day-info:
 *   post:
 *     summary: Add information for a specific day
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-26"
 *               title:
 *                 type: string
 *                 example: "Sample Day"
 *               weight:
 *                 type: number
 *                 example: 70
 *               kcal:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       '201':
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60b8d6e75b4b1e001c8d4a3e"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2023-06-26"
 *                 title:
 *                   type: string
 *                   example: "Sample Day"
 *                 weight:
 *                   type: number
 *                   example: 70
 *                 kcal:
 *                   type: number
 *                   example: 2000
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   example: "60b8d6e75b4b1e001c8d4a3e"
 */
router.post("/day-info", authMiddleware, addDayInfo);

/**
 * @swagger
 * /day-info/{id}:
 *   delete:
 *     summary: Delete information for a specific day
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the day information
 *     responses:
 *       '200':
 *         description: Successfully deleted
 *       '404':
 *         description: Information not found
 */
router.delete("/day-info/:id", authMiddleware, deleteDayInfo);

export default router;
