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

        const session = await mongoose.startSession();
        session.startTransaction();

        await booking.deleteOne({ session });

        const movie = await Movie.findById(booking.movie);
        if (movie) {
            movie.bookings.pull(booking);
            await movie.save({ session });
        }

        await session.commitTransaction();

        return res.status(200).json({ message: "Booking deleted successfully" });
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
