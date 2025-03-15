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

export default router;
