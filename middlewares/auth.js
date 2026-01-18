import jwt from "jsonwebtoken";
import UserModel from "../models/user-model.js";
import { objectIdConvert } from "../utils/objectIdConvert.js";

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = objectIdConvert(user);

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export { protectRoute };
