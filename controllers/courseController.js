import cloudinary from "../configs/cloudinary.js";
import CategoryModel from "../models/category-model.js";
import CourseModel from "../models/course-model.js";
import CourseDetailsModel from "../models/courseDetails-model.js";
import {
  objectIdArrayConvert,
  objectIdConvert,
} from "../utils/objectIdConvert.js";
 
export const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalCourses = await CourseModel.countDocuments();
    const courses = await CourseModel.find().skip(skip).limit(limit).lean();

    const coursesWithCategory = await Promise.all(
      courses.map(async (course) => {
        let category_name = null;
        if (course?.categoryId) {
          const category = await CategoryModel.findById(course.categoryId)
            .select("category_name")
            .lean();
          category_name = category ? category.category_name : null;
        }
        return { ...course, category_name };
      }),
    );

    res.status(200).json({
      success: true,
      courses: objectIdArrayConvert(coursesWithCategory),
      total: totalCourses,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
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
  console.log(courseId);

  const courseDetails = await CourseDetailsModel.findOne({ courseId });
  if (!courseDetails) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
  res.json({ success: true, data: courseDetails });
};
