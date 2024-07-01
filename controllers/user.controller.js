import asyncHandler from "express-async-handler";
import UserSchema from "../models/auth.model.js";

// Controller to update user details
export const updateUserDetails = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists by email
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found!",
    });
  }

  // Update user details
  const updatedUser = await UserSchema.findOneAndUpdate(
    { email },
    { $set: req.body },
    { new: true }
  );

  // Return success message with updated user
  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
    data: updatedUser,
  });
});
