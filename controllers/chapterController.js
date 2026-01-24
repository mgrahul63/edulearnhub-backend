import mongoose from "mongoose";
import ChapterModel from "../models/chapter-model.js";
import CourseModel from "../models/course-model.js";
import { objectIdArrayConvert } from "../utils/objectIdConvert.js";

import cloudinary from "../configs/cloudinary.js";
import BookModel from "../models/book-model.js";

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { bookName, courseId } = req.body;

    if (!bookName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let bookImageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "books" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      bookImageUrl = uploadResult.secure_url;
    }

    const book = await BookModel.create({
      bookName,
      courseId,
      ...(bookImageUrl && { bookImage: bookImageUrl }),
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update existing book
export const updateBook = async (req, res) => {
  try {
    const { bookId, bookName, courseId } = req.body;

    if (!bookId || !bookName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let updateData = { bookName, courseId };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "books" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      updateData.bookImage = uploadResult.secure_url;
    }

    const book = await BookModel.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all books (optionally for a course)
export const getBook = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = {};

    if (courseId) filter.courseId = courseId;

    const books = await BookModel.find(filter).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      books: objectIdArrayConvert(books) || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Find the book
    const book = await BookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Delete the chapter
    await BookModel.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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

export const getChapters = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const allchapters = await ChapterModel.find({ courseId: courseObjectId })
      .sort({ orderNo: 1 })
      .lean();

    const chapters = objectIdArrayConvert(allchapters);
    return res.json({ success: true, chapters });
  } catch (error) {
    console.error("Get chapters failed:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.body; // get chapterId from request body

    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "Chapter ID is required",
      });
    }

    // Find the chapter
    const chapter = await ChapterModel.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    // Delete the chapter
    await ChapterModel.findByIdAndDelete(chapterId);

    return res.json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error("Delete chapter error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
