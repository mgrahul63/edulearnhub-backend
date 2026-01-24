import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    bookImage: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional, if you want to track who added
    },
  },
  {
    timestamps: true,
  },
);

const BookModel = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default BookModel;
