import { Button, FormLabel, TextField, Typography, Alert } from "@mui/material";
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

    // Validate seat selection
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Validate date
    const selectedDate = new Date(inputs.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      alert("Booking date must be in the future.");
      return;
    }

    console.log("Selected seats:", selectedSeats);

    // Send seatNumbers instead of count
    newBooking({ seatNumbers: selectedSeats, date: inputs.date, movie: movie._id })
      .then((res) => {
        console.log(res);
        setBookedSeats([...bookedSeats, ...selectedSeats]); // Mark seats as booked
        setSelectedSeats([]); // Reset selection
        setBookingSuccess(true); // Show success message
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {movie && (
        <Fragment>
          <Typography padding={3} fontFamily="fantasy" variant="h4" textAlign="center">
            Book Tickets For: {movie.title}
          </Typography>
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
              <img width="80%" height="300px" src={movie.posterUrl} alt={movie.title} />
              <Box width="80%" marginTop={3} padding={2}>
                <Typography paddingTop={2}>{movie.description}</Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Starring: {movie.actors.join(", ")}
                </Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Release Date: {new Date(movie.releaseDate).toDateString()}
                </Typography>
              </Box>
            </Box>
            <Box width="50%" paddingTop={3}>
              {bookingSuccess ? (
                <Alert severity="success">Booking Successful! Enjoy your movie!</Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Box padding={5} margin="auto" display="flex" flexDirection="column">
                    <FormLabel>Booking Date</FormLabel>
                    <TextField
                      name="date"
                      type="date"
                      margin="normal"
                      variant="standard"
                      value={inputs.date}
                      onChange={handleDateChange}
                    />
                    <Typography fontWeight="bold" marginTop={2} textAlign="center">
                      Select Your Seats
                    </Typography>
                    <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1} marginTop={2}>
                      {[...Array(25)].map((_, index) => {
                        const seatNumber = index + 1;
                        const isBooked = bookedSeats.includes(seatNumber);
                        return (
                          <Button
                            key={seatNumber}
                            variant="contained"
                            disabled={isBooked}
                            sx={{
                              backgroundColor: isBooked
                                ? "gray"
                                : selectedSeats.includes(seatNumber)
                                ? "green"
                                : "lightblue",
                              color: "white",
                            }}
                            onClick={() => handleSeatSelection(seatNumber)}
                          >
                            {seatNumber}
                          </Button>
                        );
                      })}
                    </Box>
                    <Button type="submit" sx={{ mt: 3 }} variant="contained" color="primary">
                      Book Now
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
          </Box>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;
