import express from "express";
import {
  getCourseDetails,
  getCourses,
} from "../controllers/courseController.js";
import { checkAuth, login, signup } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    // Clear the session cookie
    res.clearCookie("connect.sid", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

// userRouter.post("/update-profile", protectRoute, updateProfile);
userRouter.post("/check", protectRoute, checkAuth);
userRouter.get("/courses", protectRoute, getCourses);
userRouter.get("/get-course-details", protectRoute, getCourseDetails);
userRouter.get("/check-enrollment", protectRoute,  getCheckEnrollment);

export default userRouter;
