// config/app.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import { sessionMiddleware } from "./configs/session.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
export const createApp = () => {
  //create express
  const app = express();

  //Midddleware for Global
  app.use(express.json({ limit: "5mb" }));
  const allowedOrigins = [
    "http://localhost:5173",
    "https://edulearnhub.vercel.app",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "token"],
    }),
  );

  app.use(sessionMiddleware);

  app.use("/api/status", (req, res) => res.send("Server is Live"));
  app.use("/api/auth", userRouter);
  app.use("/api/admin", adminRouter);
  //   app.use("/api/auth", authRouter);

  return app;
};
