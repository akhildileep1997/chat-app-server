import express from "express";
import { loginUserController, logoutUserController, signUpUserController } from "../controller/authController.js";

const router = express.Router();

//route for signing-up
router.post("/sign-up",signUpUserController);

//route for logging in
router.post("/login",loginUserController);

//route for logging-out
router.post("/log-out",logoutUserController);

export default router;
