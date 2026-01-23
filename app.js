// config/app.js
import cors from "cors";
import "dotenv/config";
import express from "express";
import { sessionMiddleware } from "./configs/session.js";
import adminRouter from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRouter from "./routes/userRoutes.js";

export const createApp = () => {
  const app = express();

  // JSON parser
  app.use(express.json({ limit: "5mb" }));

  // Allowed origins
  const allowedOrigins = [
    "https://edulearnhub.vercel.app/",
    "http://localhost:5173/",
  ];

  // CORS middleware (Vercel-safe)
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow
      } else {
        callback(null, false); // block
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  };

  // Wrap every request with cors
  app.use((req, res, next) => cors(corsOptions)(req, res, next));

  // Handle preflight OPTIONS requests for all routes
  app.options("*", (req, res) => res.sendStatus(200));

  // Session middleware
  app.use(sessionMiddleware);

  // Health check
  app.use("/api/status", (req, res) => res.send("Server is Live"));

  // Routes
  app.use("/api/auth", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/payments", paymentRoutes);

  return app;
};
