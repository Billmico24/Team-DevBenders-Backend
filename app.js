import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import specificDayRouter from "./routes/api/specificDayRoutes.js";
import calorieRoutes from './routes/api/calorieRoutes.js'; // Calorie routes
import productRoutes from './routes/api/productRoutes.js'; // Product routes
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";

import { router as authRouter } from "./routes/api/authRouter.js";
import { router as userRouter } from "./routes/api/userRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api", specificDayRouter);
app.use("/api", calorieRoutes); // Use calorie routes
app.use("/api", productRoutes); // Use product routes

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  res.status(500).json({ message: err.message });
});

export { app };
