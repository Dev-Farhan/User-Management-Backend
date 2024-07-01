import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserSchema from "../models/UserSchema";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token is present in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await UserSchema.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(403);
      throw new Error("Forbidden: Invalid token");
    }
  } else {
    res.status(403);
    throw new Error("Forbidden: No token provided");
  }
});

export default authMiddleware;
