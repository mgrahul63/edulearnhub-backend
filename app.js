// config/app.js
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

  // CORS middleware
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, token",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  // Preflight handler
  app.options("*", (req, res) => {
    res.sendStatus(204); // just respond
  });

  app.use(sessionMiddleware);

  app.use("/api/status", (req, res) => res.send("Server is Live"));
  app.use("/api/auth", userRouter);
  app.use("/api/admin", adminRouter);
  //   app.use("/api/auth", authRouter);

  return app;
};
