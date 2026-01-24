import express from "express";
import { addCategory, getCategory } from "../controllers/categoryController.js";
import {
  addCourse,
  addCourseDetails,
  deleteCourse,
  getCourseDetails,
  getCourses,
} from "../controllers/courseController.js";
import { protectRoute } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import { addChapter } from "../controllers/chapterController.js";

const adminRouter = express.Router();

// userRouter.post("/update-profile", protectRoute, updateProfile);
adminRouter.get("/get-category", protectRoute, getCategory);
adminRouter.post("/add-category", protectRoute, addCategory);

adminRouter.post(
  "/add-course",
  protectRoute,
  upload.single("image"),
  addCourse,
);
adminRouter.get("/get-course", protectRoute, getCourses);

adminRouter.delete("/delete-course", protectRoute, deleteCourse);
adminRouter.post("/add-course-details", protectRoute, addCourseDetails);
adminRouter.get("/get-course-details", protectRoute, getCourseDetails);

adminRouter.get("/courses", protectRoute, getCourses);

adminRouter.post('/add-chapter', protectRoute, addChapter)

export default adminRouter;
