import mongoose from "mongoose";
import QuestionModel from "../models/question-model.js";
import { objectIdArrayConvert } from "../utils/objectIdConvert.js";

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { bookId, chapterId, question, options } = req.body;

    if (!bookId || !chapterId) {
      return res.status(400).json({
        success: false,
        message: "bookId and chapterId are required",
      });
    }

    // Transform frontend options to match schema (_id + text + isCorrect)
    const formattedOptions = options?.map((opt) => ({
      _id: new mongoose.Types.ObjectId(),
      text: opt?.option,
      isCorrect: opt?.isCorrect || false,
    }));

    const newQuestion = await QuestionModel.create({
      bookId: mongoose.Types.ObjectId(bookId),
      chapterId: mongoose.Types.ObjectId(chapterId),
      question,
      options: formattedOptions,
    });

    res.status(201).json({
      success: true,
      message: "Successfully created!",
      data: newQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update existing question
export const updateQuestion = async (req, res) => {
  try {
    const { id, bookId, chapterId, question, options } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Question id required" });

    const questionDoc = await QuestionModel.findById(id);
    if (!questionDoc)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });

    // Update bookId or chapterId if passed
    if (bookId) questionDoc.bookId = mongoose.Types.ObjectId(bookId);
    if (chapterId) questionDoc.chapterId = mongoose.Types.ObjectId(chapterId);

    questionDoc.question = question;

    // Update options: preserve existing _id, generate new _id for new options
    questionDoc.options = options.map((opt) => ({
      _id: opt?.optionId
        ? mongoose.Types.ObjectId(opt.optionId)
        : new mongoose.Types.ObjectId(),
      text: opt?.option,
      isCorrect: opt?.isCorrect || false,
    }));

    await questionDoc.save();

    res.status(200).json({
      success: true,
      message: "Successfully updated!",
      data: questionDoc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all questions for a book + chapter
export const getQuestions = async (req, res) => {
  try {
    const { bookId, chapterId } = req.query;

    if (!bookId || !chapterId) {
      return res.status(400).json({
        success: false,
        message: "bookId and chapterId query parameters are required",
      });
    }

    const questions = await QuestionModel.find({
      bookId: mongoose.Types.ObjectId(bookId),
      chapterId: mongoose.Types.ObjectId(chapterId),
    })
      .lean()
      .sort({ createdAt: -1 }); // newest first

    res
      .status(200)
      .json({ success: true, data: objectIdArrayConvert(questions) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single question by id
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Question id required" });

    const question = await QuestionModel.findById(id);

    if (!question)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });

    res.status(200).json({ success: true, data: question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
