import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
// import swaggerUi from "swagger-ui-express";

import { specificDayRouter } from "./routes/api/specificDayRoutes.js";
import { authRouter } from "./routes/api/authRouter.js";
import { userRouter } from "./routes/api/userRouter.js";
import { dailyRateRouter } from "./routes/api/dailyRateRouter.js";
import { productRouter } from "./routes/api/productRouter.js";
// import swaggerDocument from "./swagger.json" assert { type: 'json' };

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/daily-rate", dailyRateRouter); // Use calorie routes under /api/calories
app.use("/api/product", productRouter); //  // Use product routes under /api/products

app.use("/api/specific-days", specificDayRouter); // Use specific day routes under /api/specific-days
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware for handling 404 errors
// app.use((_req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// General error handling middleware for server errors
app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export { app };
