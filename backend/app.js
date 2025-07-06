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

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 9000;

// Configure CORS based on environment
const corsOptions = {
  origin: isProduction 
    ? [process.env.FRONTEND_URL, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-frontend-domain.vercel.app']
    : [process.env.FRONTEND_URL, 'http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Regular middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware (only in development)
if (!isProduction) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use("/payment", paymentRouter);

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't expose error details in production
  const errorMessage = isProduction 
    ? 'Something went wrong!' 
    : err.message || 'Something broke!';
    
  res.status(err.status || 500).json({
    error: errorMessage,
    path: req.path,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// Handle 404 routes
app.use((req, res) => {
  if (!isProduction) {
    console.log('404 for path:', req.path);
  }
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    const mongoUri = `mongodb+srv://Dhwip:${process.env.pass}@cluster0.qrxo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to Database");
    
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// Start server if this file is run directly (not in Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  startServer();
}

// Export for Vercel serverless functions
export default app;
