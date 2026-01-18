// models/Course.js
import { mongoose, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // instructorId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   default: null,
    // },

    price: { type: Number, default: 0 },
    thumbnail: { type: String },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const CourseModel =
  mongoose.models.Course || mongoose.model("Course", courseSchema);

export default CourseModel;
