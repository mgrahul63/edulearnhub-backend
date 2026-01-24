import mongoose from "mongoose";
import ChapterModel from "../models/chapter-model.js";
import CourseModel from "../models/course-model.js";

export const addChapter = async (req, res) => {
  try {
    const { method, chapterId, courseId, title, description, orderNo } =
      req.body;

    // ----------- BASIC VALIDATION -----------
    if (!method || !courseId || !orderNo) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ----------- VALIDATE COURSE ID -----------
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const courseExists = await CourseModel.findById(courseObjectId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ----------- CREATE NEW CHAPTER -----------
    if (method === "new") {
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      // Check if orderNo already exists for this course
      const orderExists = await ChapterModel.findOne({
        courseId: courseObjectId,
        orderNo,
      });

      if (orderExists) {
        return res.json({
          success: false,
          message: "Order number already exists for this course",
        });
      }

      await ChapterModel.create({
        courseId: courseObjectId,
        title,
        description,
        orderNo,
      });

      return res.json({
        success: true,
        message: "Chapter added successfully",
      });
    }

    // ----------- EDIT EXISTING CHAPTER -----------
    if (method === "edit") {
      if (!chapterId || !mongoose.Types.ObjectId.isValid(chapterId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid chapter ID",
        });
      }

      const chapter = await ChapterModel.findById(chapterId);

      if (!chapter) {
        return res.json({
          success: false,
          message: "Chapter not found",
        });
      }

      // Update only provided fields
      chapter.title = title ?? chapter.title;
      chapter.description = description ?? chapter.description;
      chapter.orderNo = orderNo ?? chapter.orderNo;

      await chapter.save();

      return res.json({
        success: true,
        message: "Chapter updated successfully",
      });
    }

    // ----------- INVALID METHOD -----------
    return res.status(400).json({
      success: false,
      message: "Invalid method type",
    });
  } catch (error) {
    console.error("Add/Edit chapter error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
