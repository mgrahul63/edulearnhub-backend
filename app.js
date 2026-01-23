import express from "express";
import "dotenv/config";
import { sessionMiddleware } from "./configs/session.js";
import adminRouter from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRouter from "./routes/userRoutes.js"; 
import { corsMiddleware } from "./middlewares/cors.js";

export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: "5mb" }));

  // **CORS middleware**
  app.use(corsMiddleware);

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
