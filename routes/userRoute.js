import express from "express";
import protectRoute from "../middleware/protectedRoute.js";
import {
  getSingleUserDetailController,
  getUsersForSidebarController,
} from "../controller/userController.js";

const router = express.Router();

//route for getting users in side bar
router.get("/", protectRoute, getUsersForSidebarController);
//route for single user
router.get("/:id", protectRoute, getSingleUserDetailController);
//rote to update user details

export default router;
