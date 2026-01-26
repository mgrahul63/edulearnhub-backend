import express from "express";
import {
  addAnswerSheet,
  getAnswerSheets,
} from "../controllers/answerController.js";
import { addCategory, getCategory } from "../controllers/categoryController.js";
import {
  addBook,
  addChapter,
  deleteBook,
  deleteChapter,
  getBook,
  getChapters,
  updateBook,
} from "../controllers/chapterController.js";
import {
  addCourse,
  addCourseDetails,
  deleteCourse,
  getCourseDetails,
  getCourses,
} from "../controllers/courseController.js";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
} from "../controllers/questionController.js";
import { protectRoute } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

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

adminRouter.post("/add-chapter", protectRoute, addChapter);
adminRouter.get("/chapters", protectRoute, getChapters);
adminRouter.delete("/delete-chapter", protectRoute, deleteChapter);

adminRouter.post("/book", protectRoute, upload.single("bookImage"), addBook);
adminRouter.put("/book", protectRoute, upload.single("bookImage"), updateBook);
adminRouter.get("/books", protectRoute, getBook);
adminRouter.delete("/delete-book", protectRoute, deleteBook);

adminRouter.post("/question", protectRoute, createQuestion);
adminRouter.put("/question", protectRoute, updateQuestion);
// adminRouter.delete("/delete-book", protectRoute, deleteBook);
adminRouter.get("/questions", protectRoute, getQuestions);

adminRouter.post("/add-answer", protectRoute, addAnswerSheet);
adminRouter.get("/add-answers", protectRoute, getAnswerSheets);

export default adminRouter;
