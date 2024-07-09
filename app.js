import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import specificDayRouter from "./routes/api/specificDayRouter.js";
import calorieRoutes from "./routes/api/calorieRoutes.js"; // Calorie routes
import productRoutes from "./routes/api/productRoutes.js"; // Product routes

import swaggerDocument from "./swagger.json" assert { type: "json" };
import swaggerUi from "swagger-ui-express";

// import { authRouter } from "./routes/api/authRouter.js";
// import { userRouter } from "./routes/api/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
app.use("/api", calorieRoutes); // Use calorie routes
app.use("/api", productRoutes); // Use product routes

app.use("/api", specificDayRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export { app };
