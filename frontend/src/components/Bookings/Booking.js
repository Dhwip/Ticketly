import { Button, FormLabel, TextField, Typography, Alert, Paper, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ date: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    
    newBooking({ seatNumbers: selectedSeats, date: inputs.date, movie: movie._id })
      .then((res) => {
        setBookedSeats([...bookedSeats, ...selectedSeats]);
        setSelectedSeats([]);
        setBookingSuccess(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box padding={4}>
      {movie && (
        <Fragment>
          <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
            Book Tickets For: {movie.title}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <img width="100%" height="auto" src={movie.posterUrl} alt={movie.title} style={{ borderRadius: 8 }} />
                <Typography marginTop={2}>{movie.description}</Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Starring: {movie.actors.join(", ")}
                </Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Release Date: {new Date(movie.releaseDate).toDateString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                {bookingSuccess ? (
                  <Alert severity="success">Booking Successful! Enjoy your movie!</Alert>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <FormLabel>Booking Date</FormLabel>
                    <TextField
                      name="date"
                      type="date"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={inputs.date}
                      onChange={handleDateChange}
                    />
                    <Typography fontWeight="bold" marginTop={2} textAlign="center">
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
                                backgroundColor: isBooked
                                  ? "gray"
                                  : selectedSeats.includes(seatNumber)
                                  ? "green"
                                  : "lightblue",
                                color: "white",
                                '&:hover': {
                                  backgroundColor: isBooked ? "gray" : "darkblue",
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
                    <Button type="submit" fullWidth sx={{ mt: 3 }} variant="contained" color="primary">
                      Book Now
                    </Button>
                  </form>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Box>
  );
};

export default Booking;
