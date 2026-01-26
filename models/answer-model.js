import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOption: {
    type: mongoose.Schema.Types.ObjectId, // points to the _id of the option inside the question
    required: true,
  },
});

const AnswerSheetSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  yourAnswer: {
    type: [answerSchema],
    required: true,
  },
  timeTaken: {
    type: Number, // seconds
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const AnswerSheet =
  mongoose.models.AnswerSheet ||
  mongoose.model("AnswerSheet", AnswerSheetSchema);

export default AnswerSheet;

