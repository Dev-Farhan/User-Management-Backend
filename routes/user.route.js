import express from "express";
import validate from "../middleware/validate.js";
import { updateUserProfile } from "../validation/user.validation.js";
import { updateUserDetails } from "../controllers/user.controller.js";

const router = express.Router();

// Route to update user details
// POST /update
// Uses validate middleware to validate request body against updateUserProfile schema
// Calls updateUserDetails controller to update user details
router.post("/update", validate(updateUserProfile), updateUserDetails);

export default router;
