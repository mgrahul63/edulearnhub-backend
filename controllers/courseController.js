import cloudinary from "../configs/cloudinary.js";
import CourseModel from "../models/course-model.js";
import CourseDetailsModel from "../models/courseDetails-model.js";
import {
  objectIdArrayConvert,
  objectIdConvert,
} from "../utils/objectIdConvert.js";

import mongoose from "mongoose";

export const getCourses = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const { categoryId, status, instructorId } = req.query;

    // Build filter
    const filter = {};

    if (
      categoryId &&
      categoryId !== "all" &&
      mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      filter.categoryId = categoryId;
    }

    if (status === "published") {
      filter.status = "published";
    }

    if (instructorId && mongoose.Types.ObjectId.isValid(instructorId)) {
      filter.instructorId = instructorId;
    }

    const totalCourses = await CourseModel.countDocuments(filter);

    // Fetch courses with populated category and instructor
    const courses = await CourseModel.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({ path: "categoryId", select: "category_name" })
      .populate({ path: "instructorId", select: "name" })
      .lean();

    // Map to include category_name and instructorName
    const coursesWithDetails = courses.map((course) => ({
      ...course,
      category_name: course.categoryId?.category_name || null,
      instructorName: course.instructorId?.name || "N/A",
      categoryId: undefined, // remove raw ObjectId
      instructorId: undefined, // remove raw ObjectId
    }));

    res.status(200).json({
      success: true,
      message:
        coursesWithDetails.length > 0
          ? "Courses fetched successfully"
          : "No courses found",
      courses: objectIdArrayConvert(coursesWithDetails),
      total: totalCourses,
      page,
      limit,
      hasNextPage: skip + coursesWithDetails.length < totalCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      instructorId,
      price = 0,
      status = "draft",
      id,
    } = req.body;

    if (!title || !description || !categoryId || !status) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let imageUrl = "";

    // 👇 image থাকলে cloudinary upload
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "course-thumbnails" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    let course;

    if (id) {
      course = await CourseModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          categoryId,
          instructorId,
          price,
          status,
          ...(imageUrl && { thumbnail: imageUrl }),
        },
        { new: true },
      );
    } else {
      course = await CourseModel.create({
        title,
        description,
        categoryId,
        instructorId,
        price,
        status,
        ...(imageUrl && { thumbnail: imageUrl }),
      });
    }

    res.status(id ? 200 : 201).json({
      success: true,
      message: id ? "Course updated successfully" : "Course added successfully",
      course: objectIdConvert(course),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId, instructorId } = req.body;

    if (!courseId || !instructorId) {
      return res.status(400).json({
        success: false,
        message: "courseId and instructorId are required",
      });
    }
    const deletedCourse = await CourseModel.findOneAndDelete({
      _id: courseId,
      instructorId: instructorId,
    });
    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to delete it",
      });
    }
    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting course",
      error: error.message,
    });
  }
};

export const addCourseDetails = async (req, res) => {
  try {
    const {
      courseId,
      fullDescription = [],
      requirements = [],
      whatYouWillLearn = [],
      targetAudience = [],
      totalDuration = 0,
      totalLessons = 0,
      language,
      level,
      promoVideoUrl = "",
      certificate = false,
    } = req.body;

    // Validation
    if (!courseId || !language || !level) {
      return res.status(400).json({
        success: false,
        message: "courseId, language, and level are required",
      });
    }

    // Update if exists, otherwise create new
    const courseDetails = await CourseDetailsModel.findOneAndUpdate(
      { courseId }, // search by courseId
      {
        $set: {
          fullDescription,
          requirements,
          whatYouWillLearn,
          targetAudience,
          totalDuration,
          totalLessons,
          language,
          level,
          promoVideoUrl,
          certificate,
        },
      },
      { new: true, upsert: true }, // new: return updated doc, upsert: create if not exists
    );

    const message = courseDetails
      ? "Course details updated successfully"
      : "Course details created successfully";

    res.json({
      success: true,
      message,
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error adding/updating course details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding/updating course details",
      error: error.message,
    });
  }
};

export const getCourseDetails = async (req, res) => {
  const { courseId } = req.query; // ← gets the id from query string

  const courseDetails = await CourseDetailsModel.findOne({ courseId });
  if (!courseDetails) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
  res.json({ success: true, data: courseDetails });
};
