import express from "express";
import {
  addCourse,
  updateRoleToEducator,
  getEducatorCourses,
  educatorDashboard,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router();

educatorRouter.get("/updateRole", updateRoleToEducator);
educatorRouter.post(
  "/addCourse",
  upload.single("image"),
  protectEducator,
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboard);
educatorRouter.get(
  "/enrolledStudents",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
