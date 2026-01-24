import { mongoose } from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    orderNo: Number,
  },
  { timestamps: true },
);

const ChapterModel =
  mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);

export default ChapterModel;
