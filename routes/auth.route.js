import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import validate from "../middleware/validate.js";
import { login, register } from "../validation/auth.validation.js";
import { otp, resendOtpValidaion } from "../validation/otp.validation.js";

const router = express.Router();

// Route for user registration
router.post("/register", validate(register), registerUser);

// Route for user login
router.post("/login", validate(login), loginUser);

// Route for OTP verification
router.post("/verify-otp", validate(otp), verifyOtp);

// Route for OTP verification
router.post("/send-otp", validate(resendOtpValidaion), sendOtp);

export default router;
