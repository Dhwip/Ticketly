import { Button, FormLabel, TextField, Typography, Paper, Grid, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, createPaymentSession } from "../../api-helpers/api-helpers";
import axios from "axios";

const Booking = () => {
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { id } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieDetails(id);
        setMovie(response.movie);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        if (!selectedTheater || !selectedTimeSlot || !movie?._id || !selectedDate) {
          console.log('Missing required data for fetching booked seats');
          return;
        }

        const params = {
          movieId: movie._id,
          theaterId: selectedTheater.name,
          timeSlot: selectedTimeSlot.time,
          date: selectedDate
        };

        console.log('Fetching booked seats with params:', params);

        const response = await axios.get('/booking/booked-seats', { params });

        console.log('Booked seats response:', response.data);

        if (!response.data || !Array.isArray(response.data.bookedSeats)) {
          console.warn('Invalid response format:', response.data);
          return;
        }

        // Create a map of booked seats for each theater-time combination
        const bookedSeatsMap = {};
        response.data.bookedSeats.forEach(booking => {
          if (!booking.theater?.name || !booking.timeSlot?.time || !Array.isArray(booking.seatNumbers)) {
            console.warn('Invalid booking data:', booking);
            return;
          }

          const key = `${booking.theater.name}-${booking.timeSlot.time}`;
          if (!bookedSeatsMap[key]) {
            bookedSeatsMap[key] = new Set();
          }
          booking.seatNumbers.forEach(seat => {
            bookedSeatsMap[key].add(seat);
          });
        });

        setBookedSeats(bookedSeatsMap);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch booked seats';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
        
        // Log detailed error information in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            params: {
              movieId: movie?._id,
              theaterId: selectedTheater?.name,
              timeSlot: selectedTimeSlot?.time,
              date: selectedDate
            }
          });
        }
      }
    };

    fetchBookedSeats();
  }, [selectedTheater, selectedTimeSlot, selectedDate, movie]);

  useEffect(() => {
    if (selectedSeats.length > 0 && selectedTimeSlot) {
      // Get the price from the selected time slot
      const price = selectedTimeSlot.price || 0;
      const total = selectedSeats.length * price;
      console.log('Calculating total:', {
        seats: selectedSeats.length,
        price: price,
        total: total
      });
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [selectedSeats, selectedTimeSlot]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTheater("");
    setSelectedTimeSlot("");
    setSelectedSeats([]);
  };

  const handleTheaterChange = (e) => {
    const selectedTheaterName = e.target.value;
    const theater = movie.theaters.find(t => t.name === selectedTheaterName);
    if (theater) {
      setSelectedTheater(theater);
      setSelectedTimeSlot("");
      setSelectedSeats([]);
    } else {
      setSnackbar({
        open: true,
        message: 'Invalid theater selection',
        severity: 'error'
      });
    }
  };

  const handleTimeSlotChange = (e) => {
    const selectedTime = e.target.value;
    const timeSlot = selectedTheater.timeSlots.find(s => s.time === selectedTime);
    if (timeSlot) {
      console.log('Selected time slot:', timeSlot); // Debug log
      setSelectedTimeSlot(timeSlot);
      setSelectedSeats([]);
    } else {
      setSnackbar({
        open: true,
        message: 'Invalid time slot selection',
        severity: 'error'
      });
    }
  };

  const isSeatBooked = (seatNumber) => {
    if (!selectedTheater || !selectedTimeSlot) return false;
    const key = `${selectedTheater.name}-${selectedTimeSlot.time}`;
    return bookedSeats[key]?.has(seatNumber) || false;
  };

  const handleSeatClick = (seatNumber) => {
    if (!selectedTheater || !selectedTimeSlot) {
      setSnackbar({
        open: true,
        message: 'Please select theater and time slot first',
        severity: 'warning'
      });
      return;
    }

    if (isSeatBooked(seatNumber)) {
      setSnackbar({
        open: true,
        message: 'This seat is already booked',
        severity: 'warning'
      });
      return;
    }

    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber];
      return newSeats;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedDate || !selectedTheater || !selectedTimeSlot || selectedSeats.length === 0) {
        setError("Please select all required fields");
        return;
      }

      // Calculate total amount
      const totalAmount = selectedSeats.length * selectedTimeSlot.price;

      console.log("Creating payment session with data:", {
        seats: selectedSeats,
        movieTitle: movie.title,
        movieId: movie._id,
        date: selectedDate,
        theater: {
          name: selectedTheater.name,
          location: selectedTheater.location
        },
        timeSlot: {
          time: selectedTimeSlot.time,
          price: selectedTimeSlot.price
        },
        totalAmount
      });

      const response = await createPaymentSession(
        selectedSeats,
        movie.title,
        movie._id,
        selectedDate,
        {
          name: selectedTheater.name,
          location: selectedTheater.location
        },
        {
          time: selectedTimeSlot.time,
          price: selectedTimeSlot.price
        }
      );

      if (!response || !response.url) {
        throw new Error("Invalid response from payment server");
      }

      if (response.sessionId) {
        localStorage.setItem('stripeSessionId', response.sessionId);
      }
      window.location.href = response.url;
    } catch (error) {
      console.error("Error creating payment session:", error);
      setError(error.message || "Failed to create payment session");
      setSnackbar({
        open: true,
        message: error.message || "Failed to create payment session",
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: "#1a1a1a", 
        color: "#fff", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Typography variant="h5" sx={{ color: "#FFD700" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: "#1a1a1a", 
        color: "#fff", 
        py: 8,
        px: { xs: 2, sm: 4, md: 8 }
      }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#2b2d42" }}>
          <Typography variant="h5" sx={{ color: "#FFD700", mb: 2 }}>
            Error
          </Typography>
          <Typography sx={{ color: "#fff", mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setError(null)}
            sx={{
              bgcolor: "#FFD700",
              color: "#000",
              "&:hover": { bgcolor: "#FFA500" },
            }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: "#1a1a1a", 
        color: "#fff", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Typography variant="h5" sx={{ color: "#FFD700" }}>
          Movie not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "#1a1a1a", 
      color: "#fff", 
      py: 8,
      px: { xs: 2, sm: 4, md: 8 }
    }}>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#2b2d42" }}>
        <Typography variant="h4" sx={{ color: "#FFD700", mb: 4 }}>
          Book Tickets for {movie.title}
        </Typography>

        <Grid container spacing={3}>
          {/* Movie Details */}
          <Grid item xs={12} md={4}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <Typography variant="h6" sx={{ mt: 2, color: "#FFD700" }}>
              {movie.title}
            </Typography>
            <Typography sx={{ color: "#fff" }}>
              {movie.description}
            </Typography>
            <Typography sx={{ color: "#FFD700", mt: 1 }}>
              Language: {movie.language}
            </Typography>
            <Typography sx={{ color: "#FFD700" }}>
              Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
            </Typography>
          </Grid>

          {/* Booking Form */}
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#FFD700" }}>Select Date</FormLabel>
                  <TextField
                    fullWidth
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0],
                      max: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    }}
                    sx={{
                      input: { color: "#fff" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#FFD700" },
                        "&:hover fieldset": { borderColor: "#FFA500" },
                        "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#FFD700" }}>Select Theater</FormLabel>
                  <Select
                    fullWidth
                    value={selectedTheater?.name || ""}
                    onChange={handleTheaterChange}
                    required
                    disabled={!selectedDate}
                    sx={{
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD700" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FFA500" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD700" },
                    }}
                  >
                    {movie.theaters?.map((theater) => (
                      <MenuItem key={theater._id} value={theater.name}>
                        {theater.name} - {theater.location}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#FFD700" }}>Select Time Slot</FormLabel>
                  <Select
                    fullWidth
                    value={selectedTimeSlot?.time || ""}
                    onChange={handleTimeSlotChange}
                    required
                    disabled={!selectedTheater}
                    sx={{
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD700" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FFA500" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD700" },
                    }}
                  >
                    {selectedTheater?.timeSlots?.map((slot) => (
                      <MenuItem key={slot.time} value={slot.time}>
                        {slot.time} - ₹{slot.price}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Seats Selection */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "#FFD700", mb: 2 }}>
                    Select Seats
                  </Typography>
                  <Grid container spacing={2}>
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((seatNumber) => (
                      <Grid item xs={2} sm={1.5} md={1} key={seatNumber}>
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: selectedTheater && selectedTimeSlot ? 'pointer' : 'not-allowed',
                            bgcolor: isSeatBooked(seatNumber)
                              ? '#ff4444'
                              : selectedSeats.includes(seatNumber)
                              ? '#4CAF50'
                              : '#2b2d42',
                            color: '#fff',
                            borderRadius: 1,
                            border: '1px solid #FFD700',
                            opacity: selectedTheater && selectedTimeSlot ? 1 : 0.5,
                            '&:hover': {
                              bgcolor: isSeatBooked(seatNumber)
                                ? '#ff4444'
                                : selectedSeats.includes(seatNumber)
                                ? '#45a049'
                                : '#3a3d5c',
                            },
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                          }}
                          onClick={() => handleSeatClick(seatNumber)}
                        >
                          {seatNumber}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#2b2d42', border: '1px solid #FFD700', borderRadius: 1 }} />
                      <Typography variant="caption" sx={{ color: '#fff' }}>Available</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#4CAF50', border: '1px solid #FFD700', borderRadius: 1 }} />
                      <Typography variant="caption" sx={{ color: '#fff' }}>Selected</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 20, height: 20, bgcolor: '#ff4444', border: '1px solid #FFD700', borderRadius: 1 }} />
                      <Typography variant="caption" sx={{ color: '#fff' }}>Booked</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "#FFD700" }}>
                    Total Amount: ₹{totalAmount}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={selectedSeats.length === 0 || isSubmitting}
                    sx={{
                      bgcolor: "#FFD700",
                      color: "#000",
                      "&:hover": { bgcolor: "#FFA500" },
                    }}
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Booking;
