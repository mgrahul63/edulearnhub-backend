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
  const allowedOrigin = process.env.ORIGIN; // your frontend URL

  app.use(
    cors({
      origin: allowedOrigin, // only allow your frontend
      credentials: true, // allow cookies/session
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "token"], // include your custom token header
    }),
  );

  // Handle preflight OPTIONS requests
  app.options(
    "*",
    cors({
      origin: allowedOrigin,
      credentials: true,
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
