import express from "express";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
    const { movie, seatNumbers, date, user } = req.body;

    try {
        const existingMovie = await Movie.findById(movie);
        if (!existingMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const booking = new Booking({
            movie,
            seatNumbers,
            date: new Date(date),
            user
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        await booking.save({ session });

        existingMovie.bookings.push(booking);
        await existingMovie.save({ session });

        await session.commitTransaction();

        return res.status(201).json({ message: "Booking successful", booking });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});

// Get booked seats for a specific theater and time slot (MUST BE BEFORE /:id route)
router.get('/booked-seats', async (req, res) => {
  try {
    const { movieId, theaterId, timeSlot, date } = req.query;

    console.log('Received request with params:', { movieId, theaterId, timeSlot, date });

    if (!movieId || !theaterId || !timeSlot || !date) {
      return res.status(400).json({ 
        message: 'Missing required parameters',
        required: ['movieId', 'theaterId', 'timeSlot', 'date'],
        received: { movieId, theaterId, timeSlot, date }
      });
    }

    // Validate movieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ 
        message: 'Invalid movieId format',
        received: movieId
      });
    }

    // Convert date string to Date object
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Log the query we're about to execute
    const query = {
      movie: movieId,
      'theater.name': theaterId,
      'timeSlot.time': timeSlot,
      date: {
        $gte: selectedDate,
        $lt: nextDay
      }
    };

    console.log('Executing query:', JSON.stringify(query, null, 2));

    // Find all bookings for the specified movie, theater, time slot, and date
    const bookings = await Booking.find(query)
      .select('seatNumbers theater timeSlot date')
      .lean();

    console.log('Found bookings:', JSON.stringify(bookings, null, 2));

    // Extract all booked seat numbers
    const bookedSeats = bookings.reduce((seats, booking) => {
      return [...seats, ...booking.seatNumbers];
    }, []);

    res.json({ 
      bookedSeats: bookings,
      bookedSeatNumbers: bookedSeats
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Error fetching booked seats',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      name: error.name
    });
  }
});

// Create a new booking
router.post('/create', async (req, res) => {
  try {
    const { movieId, date, seatNumbers, theater, timeSlot, userId } = req.body;

    if (!movieId || !date || !seatNumbers || !theater || !timeSlot || !userId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['movieId', 'date', 'seatNumbers', 'theater', 'timeSlot', 'userId']
      });
    }

    // Check if any of the seats are already booked
    const existingBookings = await Booking.find({
      movie: movieId,
      'theater.name': theater.name,
      'timeSlot.time': timeSlot.time,
      date: date,
      seatNumbers: { $in: seatNumbers }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked',
        bookedSeats: existingBookings.map(booking => booking.seatNumbers).flat()
      });
    }

    // Create new booking
    const booking = new Booking({
      movie: movieId,
      date,
      seatNumbers,
      theater,
      timeSlot,
      user: userId,
      paymentInfo: {
        sessionId: 'pending',
        amount: seatNumbers.length * timeSlot.price,
        status: 'pending'
      }
    });

    await booking.save();

    // Update movie's bookings array
    await Movie.findByIdAndUpdate(
      movieId,
      { $push: { bookings: booking._id } }
    );

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// Get booking by ID (MUST BE AFTER specific routes)
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ booking });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if the booking date is in the past
        const bookingDate = new Date(booking.date);
        const currentDate = new Date();
        const isPastBooking = bookingDate < currentDate;

        const session = await mongoose.startSession();
        session.startTransaction();

        await booking.deleteOne({ session });

        const movie = await Movie.findById(booking.movie);
        if (movie) {
            movie.bookings.pull(booking);
            await movie.save({ session });
        }

        await session.commitTransaction();

        // Return appropriate message based on booking type
        if (isPastBooking) {
            return res.status(200).json({ 
                message: "Booking removed from history successfully",
                isPastBooking: true
            });
        } else {
            return res.status(200).json({ 
                message: "Booking canceled successfully. Your refund will be processed within 2-3 working days.",
                isPastBooking: false
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

// Get booked seats for a movie on a specific date
router.get('/booked-seats/:movieId/:date', async (req, res) => {
    try {
        const { movieId, date } = req.params;
        
        // Convert date string to Date object
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Find all bookings for this movie on the selected date
        const bookings = await Booking.find({
            movie: movieId,
            date: {
                $gte: selectedDate,
                $lt: nextDay
            }
        });

        // Extract all booked seat numbers
        const bookedSeats = bookings.reduce((seats, booking) => {
            return [...seats, ...booking.seatNumbers];
        }, []);

        res.status(200).json({ bookedSeats });
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        res.status(500).json({ message: 'Error fetching booked seats', error: error.message });
    }
});

router.get("/movie/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        const bookings = await Booking.find({ movie: movieId })
            .populate('user', 'name email')
            .populate('movie', 'title');

        return res.status(200).json({
            message: "Bookings fetched successfully",
            bookings: bookings
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to get bookings", error: err.message });
    }
});

export default router;
