import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, 
}));

app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

mongoose
  .connect(
    `mongodb+srv://Dhwip:${process.env.pass}@cluster0.qrxo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() =>
    app.listen(9000, () =>
      console.log("Connected To Database And Server is running")
    )
  )
  .catch((e) => console.log(e));
