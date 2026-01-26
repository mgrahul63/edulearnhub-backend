import AnswerSheet from "../models/answer-model.js";
import QuestionModel from "../models/question-model.js";

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

    // Build query object
    const query = {};
    if (bookId) query.bookId = bookId;
    if (chapterId) query.chapterId = chapterId;
    if (studentId) query.studentId = studentId;

    // Fetch answer sheets and populate related info
    const sheets = await AnswerSheet.find(query)
      .populate("bookId", "name")          // Book name
      .populate("chapterId", "name")       // Chapter name
      .populate("studentId", "name email") // Student info
      .lean();

    // Optional: populate question text & option text for each answer
    for (let sheet of sheets) {
      for (let ans of sheet.yourAnswer) {
        const question = await QuestionModel.findById(ans.questionID).lean();
        if (question) {
          ans.questionText = question?.question;
          const option = question.options.find(
            (opt) => opt._id.toString() === ans?.selectedOption
          );
          ans.selectedOptionText = option?.text || null;
          ans.options = question.options.map(opt => ({ id: opt._id, text: opt.text }));
        }
      }
    }

    return res.json({ success: true, data: sheets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};