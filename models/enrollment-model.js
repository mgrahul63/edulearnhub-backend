// models/Enrollment.js
import { Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

const EnrollmentModel =
  mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

export default EnrollmentModel;
