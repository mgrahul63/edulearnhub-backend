import mongoose from "mongoose";
import CourseModel from "../models/course-model.js";
import PaymentModel from "../models/payments-model.js";

export const paymentController = async (req, res) => {
  try {
    const {
      courseId,
      instructorId,
      categoryId,
      userId,
      amount,
      paymentMethod,
      mobileNumber,
      transactionId,
    } = req.body;

    if (
      !courseId ||
      !instructorId ||
      !categoryId ||
      !userId ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // ObjectId validation
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(instructorId) ||
      !mongoose.Types.ObjectId.isValid(categoryId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const isExistCourse = await CourseModel.findOne({
      _id: courseId,
      instructorId,
      categoryId,
    });

    if (!isExistCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const numericAmount = Number(amount);

    // MOCK payment logic
    const status = mobileNumber === "01733703448" ? "Approved" : "Pending";

    const createdPayment = await PaymentModel.create({
      userId,
      courseId,
      instructorId,
      categoryId,
      amount: numericAmount,
      paymentMethod,
      mobileNumber,
      transactionId,
      status,
    });

    return res.status(201).json({
      success: true,
      message:
        status === "Approved"
          ? "Payment approved successfully"
          : "Payment submitted and pending approval",
      payment: createdPayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
