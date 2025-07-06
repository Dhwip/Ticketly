import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteBooking, getUserBookings } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HistoryIcon from "@mui/icons-material/History";

const User = () => {
  const [bookings, setBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    if (userId) {
      getUserBookings(userId)
        .then((data) => {
          // Sort bookings by date (latest first)
          const sortedBookings = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setBookings(sortedBookings);
        })
        .catch((err) => console.log(err));
    }
  }, [userId]);

  // Function to check if a booking is in the past
  const isPastBooking = (bookingDate) => {
    const booking = new Date(bookingDate);
    const current = new Date();
    return booking < current;
  };

  const handleDeleteBooking = (bookingId) => {
    setSelectedBooking(bookingId);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedBooking) {
      try {
        const response = await deleteBooking(selectedBooking);
        // Remove the booking and maintain sorted order
        const updatedBookings = bookings
          .filter(booking => booking._id !== selectedBooking)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(updatedBookings);
        setMessage(response.message || "Booking cancelled successfully");
      } catch (err) {
        console.log(err);
        setMessage("Failed to delete booking");
      } finally {
        setOpenDialog(false);
      }
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#FFD700" }}>
        My Bookings
      </Typography>

      {message && (
        <Typography
          sx={{
            backgroundColor: "rgba(255, 215, 0, 0.2)",
            color: "#FFD700",
            padding: "8px",
            borderRadius: "5px",
            mb: 2,
            textAlign: "center"
          }}
        >
          {message}
        </Typography>
      )}
      
      {bookings.length === 0 ? (
        <Card sx={{ bgcolor: "#2b2d42", color: "#fff", p: 3 }}>
          <Typography variant="h6" textAlign="center">
            No bookings found. Start by booking a movie!
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/movies")}
              sx={{
                bgcolor: "#FFD700",
                color: "#000",
                "&:hover": { bgcolor: "#FFA500" },
              }}
            >
              Browse Movies
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => {
            const isPast = isPastBooking(booking.date);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={booking._id}>
                <Card sx={{ 
                  bgcolor: isPast ? "#2a2a2a" : "#2b2d42", 
                  color: "#fff",
                  opacity: isPast ? 0.8 : 1,
                  border: isPast ? "1px solid #666" : "1px solid #FFD700"
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ color: "#FFD700" }}>
                        {booking.movie?.title || "Movie Title"}
                      </Typography>
                      {isPast && (
                        <Chip 
                          label="Past Booking" 
                          size="small" 
                          sx={{ 
                            backgroundColor: "#666", 
                            color: "#fff",
                            fontSize: "0.7rem"
                          }} 
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Seat Number:</strong> {booking.seatNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Status:</strong> {booking.status}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={isPast ? <HistoryIcon /> : <DeleteForeverIcon />}
                      onClick={() => handleDeleteBooking(booking._id)}
                      sx={{
                        borderColor: isPast ? "#666" : "#f44336",
                        color: isPast ? "#666" : "#f44336",
                        "&:hover": { 
                          borderColor: isPast ? "#999" : "#d32f2f", 
                          color: isPast ? "#999" : "#d32f2f" 
                        },
                      }}
                    >
                      {isPast ? "Remove from History" : "Cancel Booking"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedBooking && bookings.find(b => b._id === selectedBooking) && 
             isPastBooking(bookings.find(b => b._id === selectedBooking).date)
              ? "Are you sure you want to remove this past booking from your history?"
              : "Are you sure you want to cancel this booking? This will initiate a refund process."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;
