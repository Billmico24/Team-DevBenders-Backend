import express from "express";
import logger from "morgan";
import cors from "cors";

import { router as authRouter } from "./routes/api/authRouter.js";
import { router as userRouter } from "./routes/api/userRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: err.message });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export { app };
