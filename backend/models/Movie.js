import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    actors: {
      type: [String],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      required: true,
      default: "English"
    },
    theaters: [{
      name: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      timeSlots: [{
        time: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true,
          default: 150
        }
      }]
    }],
    bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
