import mongoose from "mongoose";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumbers, user } = req.body;


  if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({ message: "At least one seat must be selected" });
  }

  // Ensure date is in the future
  const bookingDate = new Date(date);
  if (bookingDate <= new Date()) {
    return res.status(400).json({ message: "Booking date must be in the future" });
  }

  console.log("Data of new booking", movie, date, seatNumbers, user);

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching movie or user" });
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID" });
  }

  let booking;
  try {
    booking = new Booking({
      movie,
      date: bookingDate,
      seatNumbers,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Error creating booking", error: err.message });
  }

  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Booking.findById(id).populate("movie user");
  } catch (err) {
    return res.status(500).json({ message: "Error fetching booking", error: err.message });
  }

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Booking.findById(id).populate("user movie");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    await booking.deleteOne({ session });
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Error deleting booking", error: err.message });
  }

  return res.status(200).json({ message: "Successfully Deleted" });
};
