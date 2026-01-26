import AnswerSheet from "../models/answer-model.js";
import QuestionModel from "../models/question-model.js";
import { objectIdArrayConvert } from "../utils/objectIdConvert.js";

// Add Answer Sheet
export const addAnswerSheet = async (req, res) => {
  try {
    const { bookId, chapterId, studentId, yourAnswer, timeTaken } = req.body;

    if (!bookId || !chapterId || !studentId || !yourAnswer || !timeTaken) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Optional: Validate selectedOption exists in question
    for (let ans of yourAnswer) {
      const question = await QuestionModel.findById(ans.questionID);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: `Question not found: ${ans?.questionID}`,
        });
      }
      const optionExists = question.options.some(
        (opt) => opt._id.toString() === ans?.selectedOption,
      );
      if (!optionExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid option for question ${ans?.questionID}`,
        });
      }
    }

    const answerSheet = new AnswerSheet({
      bookId,
      chapterId,
      studentId,
      yourAnswer,
      timeTaken,
    });

    await answerSheet.save();

    return res.json({
      success: true,
      message: "Answer sheet submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all answer sheets (optional filter by book/chapter/student)
export const getAnswerSheets = async (req, res) => {
  try {
    const { bookId, chapterId, studentId } = req.query;

    const query = {};
    if (bookId) query.bookId = bookId;
    if (chapterId) query.chapterId = chapterId;
    if (studentId) query.studentId = studentId;

    const sheets = await AnswerSheet.find(query)
      .populate("bookId", "bookName")
      .populate("chapterId", "title description")
      .populate("studentId", "name email")
      .lean();

    for (const sheet of sheets) {
      // reshape book
      sheet.book = sheet.bookId
        ? {
            bookId: sheet.bookId._id,
            bookName: sheet.bookId.bookName,
          }
        : null;

      // reshape chapter
      sheet.chapter = sheet.chapterId
        ? {
            chapterId: sheet.chapterId._id,
            title: sheet.chapterId.title,
            description: sheet.chapterId.description,
          }
        : null;

      // reshape student
      sheet.student = sheet.studentId
        ? {
            name: sheet.studentId.name,
            email: sheet.studentId.email,
          }
        : null;

      delete sheet.bookId;
      delete sheet.chapterId;
      delete sheet.studentId;

      // ✅ THIS is what you were missing
      const answers = [];

      for (const ans of sheet.yourAnswer) {
        const question = await QuestionModel.findById(ans.questionID).lean();
        if (!question) continue;

        answers.push({
          questionID: ans.questionID,
          yourselectedOption: ans.selectedOption,
          questionText: question.question,
          options: question.options.map((opt) => ({
            id: opt._id,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        });
      }

      // replace yourAnswer completely
      delete sheet.yourAnswer;
      sheet.answers = answers;
    }

    return res.json({
      success: true,
      data: objectIdArrayConvert(sheets),
    });
  } catch (error) {
    console.error("getAnswerSheets error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
