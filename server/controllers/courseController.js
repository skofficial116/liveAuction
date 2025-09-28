import Course from "../models/Course.js";
import User from "../models/User.js";

export const getAllCourse = async (req, res) => {
  try {
    // const courses = await Course.find({ isPublished: true })
    //   .select(["-courseContent", "-enrolledStudents"])
    //   .populate({ path: "educator" });
    const courses = await Course.find({ isPublished: true })
      .populate({ path: "educator" });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    console.log(courseData);

    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

