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
    type: [Number],
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
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
    sessionId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);
