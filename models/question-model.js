import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: true }, // each option has its own ObjectId
);

const questionSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // every question must belong to a book
      ref: "Book", // optional, if you have a Book model
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // every question must belong to a chapter
      ref: "Chapter", // optional, if you have a Chapter model
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: [arrayLimit, "{PATH} must have at least 2 options"],
    },
  },
  { timestamps: true },
);

// Custom validator: at least 2 options
function arrayLimit(val) {
  return val.length >= 2;
}

const QuestionModel =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default QuestionModel;
