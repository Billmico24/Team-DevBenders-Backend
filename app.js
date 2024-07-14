import express from "express";
import logger from "morgan";
import cors from "cors";

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

import authRouter from "./routes/api/auth.js";
import dailyRateRouter from "./routes/api/daily-rate.js";
import dayRouter from "./routes/api/day.js";
import productRouter from "./routes/api/product.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { "type": "json" };
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/static", express.static("public")); // For access a file
app.use("/api/auth", authRouter);
app.use("/api/daily-rate", dailyRateRouter);
app.use("/product", productRouter);
app.use("/day", dayRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    message,
  });
});

export { app };
