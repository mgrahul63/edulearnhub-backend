import "dotenv/config";
import express from "express";
import { sessionMiddleware } from "./configs/session.js";
import adminRouter from "./routes/adminRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import userRouter from "./routes/userRoutes.js";
export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: "5mb" }));

  // **CORS middleware**
  app.use((req, res, next) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://edulearnhub.vercel.app",
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,token",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // Session middleware
  app.use(sessionMiddleware);

  // Health check
  app.use("/api/status", (req, res) => res.send("Server is Live"));

  // Routes
  app.use("/api/auth", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/payments", paymentRouter);

  return app;
};
