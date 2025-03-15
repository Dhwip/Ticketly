import { Button, FormLabel, TextField, Typography, Paper, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, createPaymentSession, getBookedSeats } from "../../api-helpers/api-helpers";

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ date: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const id = useParams().id;

  // Calculate min and max dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 15);

  // Format dates for input field
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => {
        setMovie(res.movie);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Fetch booked seats when date changes
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (inputs.date && movie?._id) {
        setLoading(true);
        try {
          const seats = await getBookedSeats(movie._id, inputs.date);
          setBookedSeats(seats);
        } catch (err) {
          console.error("Failed to fetch booked seats:", err);
          alert("Failed to fetch booked seats. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookedSeats();
  }, [inputs.date, movie?._id]);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setHours(0, 0, 0, 0);

    // Validate date range
    if (selectedDate < today) {
      alert("Please select today's date or a future date.");
      return;
    }
    if (selectedDate > maxDate) {
      alert("Bookings are only available up to 15 days in advance.");
      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear selected seats when date changes
    setSelectedSeats([]);
  };

  const handleSeatSelection = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      alert("This seat is already booked for the selected date!");
      return;
    }

    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber)
        : [...prevSeats, seatNumber]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!localStorage.getItem("userId")) {
        alert("Please login to book tickets");
        return;
      }

      const selectedDate = new Date(inputs.date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (!inputs.date) {
        alert("Please select a booking date.");
        return;
      }
      
      // Validate date range again
      if (selectedDate < today) {
        alert("Please select today's date or a future date.");
        return;
      }
      if (selectedDate > maxDate) {
        alert("Bookings are only available up to 15 days in advance.");
        return;
      }
      
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }

      // Check if any selected seat is already booked
      const isAnySeatBooked = selectedSeats.some(seat => bookedSeats.includes(seat));
      if (isAnySeatBooked) {
        alert("One or more selected seats are already booked. Please choose different seats.");
        return;
      }

      if (!movie || !movie._id || !movie.title) {
        alert("Invalid movie details. Please try again.");
        return;
      }

      // Create Stripe checkout session
      const response = await createPaymentSession(
        selectedSeats,
        movie.title,
        movie._id,
        inputs.date
      );

      // Show only test card information
      // alert(
      //   `Please use the following test card for payment:\n\n` +
      //   `Card Number: ${response.testCard.number}\n` +
      //   `Expiry: ${response.testCard.expiry}\n` +
      //   `CVC: ${response.testCard.cvc}\n` +
      //   `ZIP: ${response.testCard.zip}`
      // );

      // Redirect to Stripe checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error("Payment session creation failed:", err);
      alert(err.message || "Failed to create payment session. Please try again.");
    }
  };

  return (
    <Box
      width="100%"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
        padding: 4,
      }}
    >
      {movie && (
        <Fragment>
          <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold" sx={{ color: "#FFD700" }}>
            Book Tickets For: {movie.title}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper elevation={5} sx={{ padding: 2, background: "#000", color: "#fff", borderRadius: 3 }}>
                <img width="100%" height="auto" src={movie.posterUrl} alt={movie.title} style={{ borderRadius: 8 }} />
                <Typography marginTop={2}>{movie.description}</Typography>
                <Typography fontWeight="bold" marginTop={1} sx={{ color: "#FFD700" }}>
                  Starring: {movie.actors.join(", ")}
                </Typography>
                <Typography fontWeight="bold" marginTop={1} sx={{ color: "#FFD700" }}>
                  Release Date: {new Date(movie.releaseDate).toDateString()}
                </Typography>
                <Box sx={{ mt: 2, p: 2, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 2, border: '1px solid #FFD700' }}>
                  <Typography fontWeight="bold" sx={{ color: "#FFD700" }}>
                    Show Time: 21:00 (9:00 PM)
                  </Typography>
                  <Typography fontWeight="bold" sx={{ color: "#FFD700", mt: 1 }}>
                    Location: Vanilla Cinemas, Ahmedabad
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#fff", mt: 1, display: 'block' }}>
                    Please arrive 15 minutes before show time
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper elevation={5} sx={{ padding: 3, background: "#2b2d42", borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                  <FormLabel sx={{ color: "#FFD700" }}>Booking Date (Available for next 15 days only)</FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={inputs.date}
                    onChange={handleDateChange}
                    inputProps={{
                      min: formatDateForInput(today),
                      max: formatDateForInput(maxDate)
                    }}
                    sx={{ background: "#fff", borderRadius: 1 }}
                  />
                  <Typography variant="caption" sx={{ color: "#FFD700", display: 'block', mt: 1 }}>
                    Booking window: {formatDateForInput(today)} to {formatDateForInput(maxDate)}
                  </Typography>
                  <Typography fontWeight="bold" marginTop={2} textAlign="center" sx={{ color: "#FFD700" }}>
                    Select Your Seats
                  </Typography>
                  {loading ? (
                    <Typography textAlign="center" sx={{ color: "#FFD700", mt: 2 }}>
                      Loading available seats...
                    </Typography>
                  ) : (
                    <Grid container spacing={1} justifyContent="center" marginTop={2}>
                      {[...Array(25)].map((_, index) => {
                        const seatNumber = index + 1;
                        const isBooked = bookedSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);
                        return (
                          <Grid item key={seatNumber}>
                            <Button
                              variant="contained"
                              disabled={isBooked}
                              sx={{
                                minWidth: 50,
                                minHeight: 50,
                                background: isBooked 
                                  ? "gray" 
                                  : isSelected 
                                    ? "#FFD700" 
                                    : "#FFA500",
                                color: "#000",
                                fontWeight: "bold",
                                '&:hover': {
                                  background: isBooked 
                                    ? "gray" 
                                    : "#FFD700",
                                },
                                '&.Mui-disabled': {
                                  background: 'gray',
                                  color: '#fff'
                                }
                              }}
                              onClick={() => handleSeatSelection(seatNumber)}
                            >
                              {seatNumber}
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    sx={{ 
                      mt: 3, 
                      background: "linear-gradient(135deg, #FFD700, #FFA500)", 
                      color: "#000", 
                      fontWeight: "bold", 
                      borderRadius: "30px", 
                      '&:hover': { 
                        background: "#FFA500" 
                      } 
                    }}
                    variant="contained"
                  >
                    Book Now
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Box>
  );
};

export default Booking;
