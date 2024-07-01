import asyncHandler from "express-async-handler";
import UserSchema from "../models/auth.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import Otp from "../models/otp.model.js";
import { generateOTP } from "../helper/generateOtp.js";
import { generateToken } from "../helper/generateToken.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

// Regster controller
export const registerUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await UserSchema.findOne({ email });
  if (userExists) {
    return res.status(400).send({
      success: false,
      message: "User already exists !",
    });
  }

  const otp = generateOTP();
  await Otp.create({ email, otp });

  const user = await UserSchema.create({
    ...req.body,
  });

  if (user) {
    sendEmail(email, "Email verification", otp).catch((error) => {
      console.error("Failed to send email:", error);
    });
  }

  return res.status(201).send({
    success: true,
    message: "User Register Successfully",
  });
});

// Login controller
export const loginUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserSchema.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate OTP
  const otp = generateOTP();

  // Store OTP in the database
  await Otp.create({ email, otp });

  // Send OTP to user's email
  await sendEmail(email, "Your OTP Code", otp);

  // Generate JWT token
  const token = generateToken(user._id);

  // Respond with the token
  res.status(200).json({
    success: true,
    message: "OTP sent to email. Use it to verify your login.",
    token,
    user,
  });
});

// Verify OTP controller
// export const sendOtp = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;

//   // Retrieve the stored OTP
//   const storedOtp = await Otp.findOne({ email });

//   if (!storedOtp) {
//     return res.status(400).send({
//       success: false,
//       message: "OTP expired or invalid. Please request a new OTP.",
//     });
//   }

//   if (storedOtp.otp !== otp) {
//     return res.status(400).send({
//       success: false,
//       message: "Invalid OTP. Please try again.",
//     });
//   }

//   // OTP verified successfully, delete OTP from database
//   await Otp.deleteOne({ email });

//   // Update user verification status
//   await UserSchema.updateOne({ email }, { isVerified: true });

//   // Generate JWT token
//   const user = await UserSchema.findOne({ email });
//   const token = jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       isVerified: user.isVerified,
//     },
//     JWT_SECRET,

//   );

//   res.status(200).send({
//     success: true,
//     message: "OTP verified successfully. Your account is now activated.",
//     token, // Include the token in the response
//   });
// });

export const verifyOtp = asyncHandler(async (req, res) => {
  console.log("Request received:", req.body);

  const { email, otp } = req.body;

  console.log("Fetching stored OTP for email:", email);
  const storedOtp = await Otp.findOne({ email });

  if (!storedOtp) {
    console.error("No OTP found for email:", email);
    return res.status(400).send({
      success: false,
      message: "OTP expired or invalid. Please request a new OTP.",
    });
  }

  console.log("Stored OTP found:", storedOtp.otp);

  if (storedOtp.otp !== otp) {
    console.error("Invalid OTP. Provided:", otp, "Expected:", storedOtp.otp);
    return res.status(400).send({
      success: false,
      message: "Invalid OTP. Please try again.",
    });
  }

  console.log("OTP verified successfully for email:", email);

  // OTP verified successfully, delete OTP from database
  console.log("Deleting OTP for email:", email);
  await Otp.deleteOne({ email });

  // Update user verification status
  console.log("Updating user verification status for email:", email);
  await UserSchema.updateOne({ email }, { isVerified: true });

  // Generate JWT token
  console.log("Generating JWT token for email:", email);
  const user = await UserSchema.findOne({ email });
  if (!user) {
    console.error("User not found after OTP verification:", email);
    return res.status(400).send({
      success: false,
      message: "User not found.",
    });
  }
  console.log("Token generating:", user._id);

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified,
    },
    JWT_SECRET
  );

  console.log("Token generated successfully for user:", user._id);

  res.status(200).send({
    success: true,
    message: "OTP verified successfully. Your account is now activated.",
    token,
    user,
  });

  console.log("Response sent successfully for email:", email);
});

// export const resendOtp = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//     // Find user by email
//     const user = await UserSchema.findOne({ email });
//     if (!user) {
//       return res.status(400).send({
//         success: false,
//         message:"User not found",
//       });

//     }

//   // Generate OTP
//   const otp = generateOTP();

//   // Store OTP in the database
//   await Otp.create({ email, otp });

// try {
//   await sendEmail(email, "Email verification", otp);
// } catch (error) {
//   console.error("Failed to send email:", error);
//   return res.status(500).send({
//     success: false,
//     message: "Failed to send OTP email",
//   });
// }

// return res.status(201).send({
//   success: true,
//   message: "OTP sent successfully",
// });

// })

// export const resendOtp = asyncHandler(async (req, res) => {
//   console.log("Request received:", req.body);

//   const { email } = req.body;

//   console.log("Looking for user with email:", email);
//   const user = await UserSchema.findOne({ email });

//   if (!user) {
//     console.error("User not found for email:", email);
//     return res.status(400).send({
//       success: false,
//       message: "User not found",
//     });
//   }

//   console.log("User found:", user);

//   // Generate OTP
//   const otp = generateOTP();
//   console.log("Generated OTP:", otp);

//   // Store OTP in the database
//   console.log("Storing OTP in database for email:", email);
//   await Otp.create({ email, otp });
//   console.log("OTP stored successfully");

//   try {
//     console.log("Sending email to:", email);
//     await sendEmail(email, "Email verification", otp);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Failed to send email:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Failed to send OTP email",
//     });
//   }

//   console.log("OTP sent successfully to email:", email);
//   return res.status(201).send({
//     success: true,
//     message: "OTP sent successfully",
//   });
// });

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserSchema.findOne({ email });
  const otpExists = await Otp.findOne({ email });

  if (!user) {
    return res.status(400).send({
      success: false,
      message:
        "User not registered.  Please check the email address and try again.",
    });
  }

  if (otpExists) {
    return res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  }

  // Generate OTP
  const otp = generateOTP();

  try {
    // Store OTP in the database and send email concurrently
    await Promise.all([
      Otp.create({ email, otp }),
      sendEmail(email, "Email verification", otp),
    ]);

    return res.status(201).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Otp send successfully please check your email",
    });
  }
});
