import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > new Date(); // Ensures booking date is in the future
      },
      message: "Booking date must be in the future",
    },
  },
  seatNumbers: {
    type: [Number], // Array of seat numbers
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Booking", bookingSchema);
