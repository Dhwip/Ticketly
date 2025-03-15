import { Button, FormLabel, TextField, Typography, Paper, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, createPaymentSession } from "../../api-helpers/api-helpers";

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ date: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const id = useParams().id;

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => {
        setMovie(res.movie);
        setBookedSeats(res.movie.bookedSeats || []);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleDateChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSeatSelection = (seatNumber) => {
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!inputs.date) {
        alert("Please select a booking date.");
        return;
      }
      
      if (selectedDate <= today) {
        alert("Please select a future date for booking.");
        return;
      }
      
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
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

      // Show test card information
      alert(`Use the following test card for payment:\nCard Number: ${response.testCard.number}\nExpiry: ${response.testCard.expiry}\nCVC: ${response.testCard.cvc}\nZIP: ${response.testCard.zip}`);

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
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper elevation={5} sx={{ padding: 3, background: "#2b2d42", borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                  <FormLabel sx={{ color: "#FFD700" }}>Booking Date</FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={inputs.date}
                    onChange={handleDateChange}
                    sx={{ background: "#fff", borderRadius: 1 }}
                  />
                  <Typography fontWeight="bold" marginTop={2} textAlign="center" sx={{ color: "#FFD700" }}>
                    Select Your Seats
                  </Typography>
                  <Grid container spacing={1} justifyContent="center" marginTop={2}>
                    {[...Array(25)].map((_, index) => {
                      const seatNumber = index + 1;
                      const isBooked = bookedSeats.includes(seatNumber);
                      return (
                        <Grid item key={seatNumber}>
                          <Button
                            variant="contained"
                            disabled={isBooked}
                            sx={{
                              minWidth: 50,
                              minHeight: 50,
                              background: isBooked ? "gray" : selectedSeats.includes(seatNumber) ? "#FFD700" : "#FFA500",
                              color: "#000",
                              fontWeight: "bold",
                              '&:hover': {
                                background: isBooked ? "gray" : "#FFD700",
                              },
                            }}
                            onClick={() => handleSeatSelection(seatNumber)}
                          >
                            {seatNumber}
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    sx={{ mt: 3, background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#000", fontWeight: "bold", borderRadius: "30px", '&:hover': { background: "#FFA500" } }}
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
