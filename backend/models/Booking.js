import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    seatNumbers: {
      type: [Number],
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    theater: {
      name: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      }
    },
    timeSlot: {
      time: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    },
    paymentInfo: {
      paymentId: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
      }
    }
  },
  { timestamps: true }
);

// Check if the model exists before creating it
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking; 