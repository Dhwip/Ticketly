import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
import Booking from "../models/Booking.js";

export const addMovie = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const extractedToken = req.headers.authorization.split(" ")[1];
    if (!extractedToken) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    let uid;
    try {
      // Log the token for debugging (remove in production)
      console.log("Received token:", extractedToken);
      console.log("Secret key:", process.env.SECRET_KEY);
      
      const decodedToken = jwt.verify(extractedToken, process.env.SECRET_KEY);
      uid = decodedToken.id;
      console.log("Decoded token:", decodedToken);
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ 
        message: "Invalid or expired token",
        error: err.message 
      });
    }

    const { title, description, releaseDate, posterUrl, featured, language, actors, theaters } = req.body;

    // Validate required fields
    if (!title || !description || !releaseDate || !posterUrl || !language || !actors || !theaters) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    // Validate theaters array
    if (!Array.isArray(theaters) || theaters.length === 0) {
      return res.status(422).json({ message: "At least one theater is required" });
    }

    // Validate each theater
    for (const theater of theaters) {
      if (!theater.name || !theater.location || !Array.isArray(theater.timeSlots) || theater.timeSlots.length === 0) {
        return res.status(422).json({ message: "Invalid theater data" });
      }
      
      // Validate time slots
      for (const slot of theater.timeSlots) {
        if (!slot.time || typeof slot.price !== 'number' || slot.price < 0) {
          return res.status(422).json({ message: "Invalid time slot data" });
        }
      }
    }

    const movie = new Movie({
      title,
      description,
      releaseDate,
      featured: featured || false,
      posterUrl,
      language,
      actors: Array.isArray(actors) ? actors : actors.split(',').map(actor => actor.trim()),
      theaters,
      admin: uid,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await movie.save({ session });
      const adminUser = await Admin.findById(uid);
      if (!adminUser) {
        throw new Error("Admin not found");
      }
      adminUser.addedMovies.push(movie);
      await adminUser.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return res.status(201).json({ 
      message: "Movie added successfully",
      movie 
    });
  } catch (err) {
    console.error("Error adding movie:", err);
    return res.status(500).json({ 
      message: "Failed to add movie",
      error: err.message 
    });
  }
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request failed" });
  }

  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

export const deleteMovie = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Unable to Find the Movie" });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await movie.deleteOne({ session });
    const adminUser = await Admin.findById(movie.admin);
    adminUser.addedMovies.pull(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete" });
  }

  return res.status(200).json({ message: "Successfully Deleted" });
};
