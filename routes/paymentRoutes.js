import express from "express";
import { paymentController } from "../controllers/paymentController";
import { protectRoute } from "../middlewares/auth";

const paymentRouter = express.Router();

paymentRouter.post("/process-payment", protectRoute, paymentController);

export default paymentRouter;
