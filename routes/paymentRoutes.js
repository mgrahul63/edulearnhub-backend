import express from "express";
import { paymentController } from "../controllers/paymentController.js";
import { protectRoute } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/process-payment", protectRoute, paymentController);

export default paymentRouter;
