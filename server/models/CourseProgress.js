import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" , required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
    completed: { type: Boolean, default: false },
    lecturesCompleted: [],
  },
 {minimize:false}
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;
