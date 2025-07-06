import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import cors from "cors";

dotenv.config();
const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Regular middleware
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use("/payment", paymentRouter);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Something broke!',
    path: req.path
  });
});

// Handle 404 routes
app.use((req, res) => {
  console.log('404 for path:', req.path);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://Dhwip:${process.env.pass}@cluster0.qrxo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to Database");
    
    const port = process.env.PORT || 9000;
    app.listen(port, () =>
      console.log(`Server is running on port ${port}`)
    );
  } catch (e) {
    console.log("Connection error:", e);
  }
};

// Start server if this file is run directly
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Export for Vercel
export default app;
