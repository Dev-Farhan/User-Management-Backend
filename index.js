import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to log the request URL and method
app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}, Method: ${req.method}`);
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Handle 404 errors
app.all('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});


// Start the server and connect to the database
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
  connectDB();
});

// Global error handling middleware
app.use(errorHandler);