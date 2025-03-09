import axios from "axios";

export const getAllMovies = async () => {
  try {
    const res = await axios.get("http://localhost:9000/movie");
    return res.data;
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
};

export const sendUserAuthRequest = async (data, signup) => {
  try {
    const res = await axios.post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    console.error("User authentication failed:", err);
  }
};

export const sendAdminAuthRequest = async (data) => {
  try {
    const res = await axios.post("/admin/login", {
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    console.error("Admin authentication failed:", err);
  }
};

export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`/movie/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching movie details:", err);
  }
};

export const newBooking = async (data) => {
  try {
    const res = await axios.post("/booking", {
      movie: data.movie,
      seatNumbers: data.seatNumbers, // Corrected to send an array
      date: data.date,
      user: localStorage.getItem("userId"),
    });

    return res.data;
  } catch (err) {
    console.error("Error creating new booking:", err);
  }
};

export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err);
  }
};

export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user details:", err);
  }
};

export const addMovie = async (data) => {
  try {
    const res = await axios.post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        featured: data.featured, // Fixed typo
        actors: data.actors,
        admin: localStorage.getItem("adminId"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding movie:", err);
  }
};

export const getAdminById = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    const res = await axios.get(`/admin/${adminId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching admin details:", err);
  }
};
