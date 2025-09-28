import express from "express";
import {
  getUserData,
  purchaseCourse,
  userEnrolledCourses,
  updateUserCourseProgress, 
  getUserCourseProgress,
  addUserRating
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolledCourses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);

userRouter.post("/updateCourseProgress", updateUserCourseProgress);
userRouter.post("/getCourseProgress", getUserCourseProgress);
userRouter.post("/addRating", addUserRating);

export default userRouter;
