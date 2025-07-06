import { Box, Typography, IconButton, List, ListItem, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Divider, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteBooking, getUserBooking, getUserDetails } from "../api-helpers/api-helpers";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUserBooking().then((res) => {
      // Sort bookings by date (latest first)
      const sortedBookings = res.bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
      setBookings(sortedBookings);
    }).catch(console.error);
    getUserDetails().then((res) => setUser(res.user)).catch(console.error);
  }, []);

  const handleDelete = (id) => {
    setSelectedBooking(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking)
        .then((response) => {
          // Remove the booking and maintain sorted order
          const updatedBookings = bookings
            .filter((booking) => booking._id !== selectedBooking)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setBookings(updatedBookings);
          // Use the message from the backend response
          setMessage(response.message || "Booking cancelled successfully");
        })
        .catch(console.error)
        .finally(() => setOpenDialog(false));
    }
  };

  // Function to check if a booking is in the past
  const isPastBooking = (bookingDate) => {
    const booking = new Date(bookingDate);
    const current = new Date();
    return booking < current;
  };

  // Function to get appropriate delete button text and icon
  const getDeleteButtonProps = (booking) => {
    const isPast = isPastBooking(booking.date);
    return {
      text: isPast ? "Remove from History" : "Cancel Booking",
      icon: isPast ? <HistoryIcon /> : <DeleteForeverIcon />,
      color: isPast ? "#666" : "#FFD700"
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
      }}
    >
      {user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#2b2d42",
            padding: 4,
            borderRadius: 4,
            width: "350px",
            textAlign: "center",
            border: "2px solid #FFD700",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Avatar sx={{ width: 100, height: 100, backgroundColor: "#FFD700", mb: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 80, color: "#000" }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>{user.email}</Typography>
        </Box>
      )}

      <Box
        sx={{
          mt: 4,
          width: "85%",
          maxWidth: "800px",
          background: "#2b2d42",
          borderRadius: 3,
          padding: 3,
          border: "2px solid #FFD700",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={2}
          sx={{ color: "#FFD700" }}
        >
          My Bookings
        </Typography>

        {message && (
          <Typography
            textAlign="center"
            sx={{
              backgroundColor: "rgba(255, 215, 0, 0.2)",
              color: "#FFD700",
              padding: "8px",
              borderRadius: "5px",
              mb: 2,
            }}
          >
            {message}
          </Typography>
        )}

        <List>
          {bookings.length ? (
            bookings.map((booking) => {
              const isPast = isPastBooking(booking.date);
              const deleteProps = getDeleteButtonProps(booking);
              
              return (
                <ListItem
                  key={booking._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: isPast ? "#2a2a2a" : "#3a3d56",
                    borderRadius: 2,
                    padding: 2,
                    marginBottom: 2,
                    border: isPast ? "1px solid #666" : "1px solid #FFD700",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { 
                      transform: "scale(1.02)", 
                      background: isPast ? "#333" : "#43465a" 
                    },
                    opacity: isPast ? 0.8 : 1,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography fontWeight="bold" sx={{ color: "#FFD700", fontSize: "1.2rem" }}>
                        🎬 {booking.movie.title}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ color: "#fff" }}>
                        🏢 Theater: {booking.theater.name} - {booking.theater.location}
                      </Typography>
                      <Typography sx={{ color: "#fff" }}>
                        ⏰ Time: {booking.timeSlot.time}
                      </Typography>
                      <Typography sx={{ color: "#fff" }}>
                        🎟 Seats: {booking.seatNumbers.join(", ")}
                      </Typography>
                      <Typography sx={{ color: "#fff" }}>
                        📅 Date: {new Date(booking.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(booking._id)}
                    sx={{ 
                      color: deleteProps.color, 
                      transition: "0.2s", 
                      "&:hover": { color: isPast ? "#999" : "#FFA500" },
                      ml: 2
                    }}
                    title={deleteProps.text}
                  >
                    {deleteProps.icon}
                  </IconButton>
                </ListItem>
              );
            })
          ) : (
            <Typography textAlign="center" opacity={0.8}>
              No bookings yet.
            </Typography>
          )}
        </List>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            {selectedBooking && bookings.find(b => b._id === selectedBooking) && 
             isPastBooking(bookings.find(b => b._id === selectedBooking).date)
              ? "Are you sure you want to remove this past booking from your history?"
              : "Are you sure you want to cancel this booking? This will initiate a refund process."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: "#000",
              backgroundColor: "#FFD700",
              "&:hover": { backgroundColor: "#FFA500" },
              fontWeight: "bold",
            }}
          >
            No
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              color: "#fff",
              backgroundColor: "#FF0000",
              "&:hover": { backgroundColor: "#D00000" },
              fontWeight: "bold",
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
