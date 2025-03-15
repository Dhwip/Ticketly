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
  const res = await axios
    .post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));

  if (res.status !== 200 && res.status !== 201) {
    console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const sendAdminAuthRequest = async (data) => {
  const res = await axios
    .post("/admin/login", {
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpectyed Error");
  }

  const resData = await res.data;
  return resData;
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
  const res = await axios
    .delete(`/booking/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unepxected Error");
  }

  const resData = await res.data;
  return resData;
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

export const addMovie = async (data) => {
  const res = await axios
    .post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        fetaured: data.fetaured,
        actors: data.actors,
        admin: localStorage.getItem("adminId"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .catch((err) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
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

export const createPaymentSession = async (selectedSeats, movieTitle, movieId, date) => {
  try {
    console.log('Creating payment session for:', { selectedSeats, movieTitle, movieId, date });
    
    // Validate inputs
    if (!selectedSeats || selectedSeats.length === 0) {
      throw new Error('Please select at least one seat');
    }
    if (!movieTitle || !movieId) {
      throw new Error('Movie details are missing');
    }
    if (!date) {
      throw new Error('Please select a booking date');
    }
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error('Please login to book tickets');
    }

    // Calculate total amount (150 INR per seat)
    const totalAmount = selectedSeats.length * 150;

    const res = await axios.post("/payment/create-checkout-session", {
      selectedSeats,
      movieTitle,
      movieId,
      userId,
      date,
      totalAmount
    });
    
    console.log('Payment session created:', res.data);

    // Store session ID for verification
    localStorage.setItem('stripeSessionId', res.data.sessionId);
    
    return {
      url: res.data.url,
      sessionId: res.data.sessionId,
      testCard: res.data.testCard
    };
  } catch (error) {
    console.error("Payment error:", error.response || error);
    throw error;
  }
};

export const verifyPayment = async () => {
  try {
    const sessionId = localStorage.getItem('stripeSessionId');
    if (!sessionId) {
      throw new Error('No payment session found');
    }

    console.log('Verifying payment for session:', sessionId);
    const res = await axios.get(`${axios.defaults.baseURL}/payment/verify-payment/${sessionId}`);
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
