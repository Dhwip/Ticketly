import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:9000";
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const getAllMovies = async () => {
  const res = await axios.get("http://localhost:9000/movie").catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("No Data");
  }

  const data = await res.data;
  return data;
};

export const sendUserAuthRequest = async (data, signup) => {
  try {
    const res = await axios.post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Authentication failed");
    }

    const resData = await res.data;
    
    // Store user token and ID with consistent keys
    if (resData.token) {
      localStorage.setItem("token", resData.token);
      localStorage.setItem("id", resData.id);
      // Also store user-specific data
      localStorage.setItem("userToken", resData.token);
      localStorage.setItem("userId", resData.id);
    }

    return resData;
  } catch (err) {
    console.error("User authentication error:", err);
    throw err;
  }
};

export const sendAdminAuthRequest = async (data) => {
  try {
    const res = await axios.post("/admin/login", {
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200) {
      throw new Error("Login failed");
    }

    const resData = await res.data;
    
    // Store the token and admin ID with consistent keys
    if (resData.token) {
      localStorage.setItem("adminToken", resData.token);
      localStorage.setItem("adminId", resData.id);
      localStorage.setItem("token", resData.token);
    }

    return resData;
  } catch (err) {
    console.error("Admin login error:", err);
    throw err;
  }
};

export const getMovieDetails = async (id) => {
  const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const newBooking = async (data) => {
  try {
    const res = await axios.post("/booking", {
      movie: data.movie,
      seatNumbers: data.seatNumbers,
      date: data.date,
      user: localStorage.getItem("userId"),
    });

    if (res.status !== 201) {
      throw new Error("Booking creation failed");
    }
    return res.data;
  } catch (error) {
    console.error("Booking error:", error);
    throw error;
  }
};

export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios
    .get(`/user/bookings/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);
    
    if (res.status !== 200) {
      throw new Error("Failed to delete booking");
    }

    return res.data;
  } catch (err) {
    console.error("Delete booking error:", err);
    
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    
    throw new Error(err.message || "Failed to delete booking");
  }
};

export const getUserDetails = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios.get(`/user/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const addMovie = async (inputs) => {
  try {
    const token = localStorage.getItem("adminToken");
    const adminId = localStorage.getItem("adminId");

    if (!token || !adminId) {
      throw new Error("Admin authentication required");
    }

    // Log the token for debugging (remove in production)
    console.log("Token:", token);
    console.log("Admin ID:", adminId);

    const response = await axios.post(
      "/movie",
      {
        ...inputs,
        admin: adminId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to add movie");
    }

    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    
    if (error.response?.status === 401) {
      // Instead of removing tokens, just throw an error
      throw new Error("Invalid or expired session. Please try logging in again.");
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || "Failed to add movie. Please try again.");
  }
};

export const getAdminById = async () => {
  const adminId = localStorage.getItem("adminId");
  const res = await axios
    .get(`/admin/${adminId}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const getAdminData = async () => {
  const adminId = localStorage.getItem("adminId");
  const res = await axios
    .get(`/admin/${adminId}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const getUserBookings = async (userId) => {
  const res = await axios
    .get(`/user/bookings/${userId}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData.bookings || [];
};

export const createPaymentSession = async (seatNumbers, movieTitle, movieId, date, theater, timeSlot) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem("userId") || localStorage.getItem("id");
    
    // Log the request data for debugging
    console.log("Creating payment session with data:", {
      seatNumbers,
      movieTitle,
      movieId,
      date,
      theater,
      timeSlot,
      userId
    });

    // Ensure the data structure is correct
    const requestData = {
      seatNumbers,
      movieTitle,
      movieId,
      date,
      theater: {
        name: theater.name,
        location: theater.location
      },
      timeSlot: {
        time: timeSlot.time,
        price: timeSlot.price
      },
      userId
    };

    const response = await axios.post(
      "/payment/create-session",
      requestData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data || !response.data.url) {
      throw new Error("Invalid response from payment server");
    }

    // Store the session ID for later verification
    if (response.data.sessionId) {
      localStorage.setItem('stripeSessionId', response.data.sessionId);
    }

    return response.data;
  } catch (error) {
    console.error("Payment session creation error:", error);
    
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || "Failed to create payment session. Please try again.");
  }
};

export const verifyPayment = async () => {
  try {
    const sessionId = localStorage.getItem('stripeSessionId');
    if (!sessionId) {
      throw new Error('No payment session found');
    }

    console.log('Verifying payment for session:', sessionId);
    const res = await axios.get(`/payment/verify-payment/${sessionId}`);
    console.log('Payment verification result:', res.data);
    
    return res.data;
  } catch (error) {
    console.error("Payment verification error:", error.response || error);
    throw error;
  }
};

export const getBookedSeats = async (movieId, date) => {
    try {
        const formattedDate = date.split('T')[0]; // Format date as YYYY-MM-DD
        const res = await axios.get(`${axios.defaults.baseURL}/booking/booked-seats/${movieId}/${formattedDate}`);
        return res.data.bookedSeats;
    } catch (err) {
        console.error("Error fetching booked seats:", err);
        throw new Error("Failed to fetch booked seats");
    }
};

export const getMovieById = async (id) => {
  try {
    const res = await axios.get(`/movie/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching movie:", err);
    throw err;
  }
};

export const getBookingsByMovieId = async (movieId) => {
  try {
    const res = await axios.get(`/booking/movie/${movieId}`);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error('Failed to fetch bookings');
  } catch (err) {
    console.error("Error fetching bookings:", err);
    throw err;
  }
};

export const sendPasswordResetRequest = async (email) => {
  try {
    const res = await axios.post("/user/forgot-password", { email });
    return res.data;
  } catch (err) {
    console.error("Password reset request error:", err);
    throw err;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const res = await axios.post("/user/reset-password", { token, newPassword });
    return res.data;
  } catch (err) {
    console.error("Password reset error:", err);
    throw err;
  }
};

export const verifyResetToken = async (token) => {
  try {
    const res = await axios.get(`/user/verify-reset-token/${token}`);
    return res.data;
  } catch (err) {
    console.error("Token verification error:", err);
    throw err;
  }
};
