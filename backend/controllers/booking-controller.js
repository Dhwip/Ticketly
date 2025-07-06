import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumbers, user, theater, timeSlot } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return res.status(500).json({ message: "Error finding movie or user", error: err.message });
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID" });
  }

  // Validate theater and time slot
  const selectedTheater = existingMovie.theaters.find(t => 
    t.name === theater.name && t.location === theater.location
  );
  
  if (!selectedTheater) {
    return res.status(400).json({ message: "Invalid theater selected" });
  }

  const selectedTimeSlot = selectedTheater.timeSlots.find(s => 
    s.time === timeSlot.time && s.price === timeSlot.price
  );

  if (!selectedTimeSlot) {
    return res.status(400).json({ message: "Invalid time slot selected" });
  }

  let booking;
  try {
    booking = new Booking({
      movie,
      date: new Date(date),
      seatNumbers,
      user,
      theater: {
        name: selectedTheater.name,
        location: selectedTheater.location
      },
      timeSlot: {
        time: selectedTimeSlot.time,
        price: selectedTimeSlot.price
      },
      paymentInfo: {
        paymentId: "pending",
        amount: seatNumbers.length * selectedTimeSlot.price,
        status: "pending"
      }
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    return res.status(500).json({ 
      message: "Unable to create booking", 
      error: err.message 
    });
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Booking.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
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

    // Check if the booking date is in the past
    const bookingDate = new Date(booking.date);
    const currentDate = new Date();
    const isPastBooking = bookingDate < currentDate;

    // If it's a past booking, just remove it from history without refund message
    if (isPastBooking) {
      const session = await mongoose.startSession();
      session.startTransaction();

      await booking.user.bookings.pull(booking);
      await booking.movie.bookings.pull(booking);

      await booking.movie.save({ session });
      await booking.user.save({ session });

      await Booking.findByIdAndDelete(id); 

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ 
        message: "Booking removed from history successfully",
        isPastBooking: true
      });
    }

    // For future bookings, proceed with normal cancellation
    const session = await mongoose.startSession();
    session.startTransaction();

    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);

    await booking.movie.save({ session });
    await booking.user.save({ session });

    await Booking.findByIdAndDelete(id); 

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ 
      message: "Booking canceled successfully. Your refund will be processed within 2-3 working days.",
      isPastBooking: false
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to delete booking" });
  }
};

