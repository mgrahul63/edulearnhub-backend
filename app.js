// config/app.js
import cors from "cors";
import express from "express";
import { sessionMiddleware } from "./configs/session.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";

export const createApp = () => {
  //create express
  const app = express();

  //Midddleware for Global
  app.use(express.json({ limit: "5mb" }));
  app.use(
    cors({
      origin: "https://edulearnhub.vercel.app",
      credentials: true,
    }),
  );

  app.use(sessionMiddleware);

  app.use("/api/status", (req, res) => res.send("Server is Live"));
  app.use("/api/auth", userRouter);
  app.use("/api/admin", adminRouter);
  //   app.use("/api/auth", authRouter);

  return app;
};
