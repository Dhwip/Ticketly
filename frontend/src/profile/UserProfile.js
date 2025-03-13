import { Box, Typography, IconButton, List, ListItem, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteBooking, getUserBooking, getUserDetails } from "../api-helpers/api-helpers";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUserBooking().then((res) => setBookings(res.bookings)).catch(console.error);
    getUserDetails().then((res) => setUser(res.user)).catch(console.error);
  }, []);

  const handleDelete = (id) => {
    setSelectedBooking(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking)
        .then(() => {
          setBookings((prev) => prev.filter((booking) => booking._id !== selectedBooking));
          setMessage("Booking cancellation successful.");
        })
        .catch(console.error)
        .finally(() => setOpenDialog(false));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      {user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            padding: 4,
            borderRadius: 4,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            width: "350px",
            textAlign: "center",
            color: "white",
          }}
        >
          <Avatar sx={{ width: 100, height: 100, backgroundColor: "#fff", mb: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 80, color: "#2a5298" }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>{user.email}</Typography>
        </Box>
      )}
      
      <Box
        sx={{
          mt: 4,
          width: "80%",
          maxWidth: "800px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(8px)",
          borderRadius: 3,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
          padding: 3,
          color: "white",
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>My Bookings</Typography>
        {message && <Typography color="success.main" textAlign="center" mb={2}>{message}</Typography>}
        <List>
          {bookings.length ? bookings.map((booking) => (
            <ListItem
              key={booking._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                padding: 2,
                marginBottom: 2,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Box>
                <Typography fontWeight="bold">🎬 {booking.movie.title}</Typography>
                <Typography>🎟 Seats: {booking.seatNumbers.join(", ")}</Typography>
                <Typography>📅 {new Date(booking.date).toDateString()}</Typography>
              </Box>
              <IconButton onClick={() => handleDelete(booking._id)} color="error">
                <DeleteForeverIcon fontSize="large" />
              </IconButton>
            </ListItem>
          )) : (
            <Typography textAlign="center" opacity={0.8}>No bookings yet.</Typography>
          )}
        </List>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to cancel this booking?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">No</Button>
          <Button onClick={confirmDelete} color="error">Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
