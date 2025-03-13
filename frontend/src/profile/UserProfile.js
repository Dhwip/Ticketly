import { Box, Typography, IconButton, List, ListItem, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Divider } from "@mui/material";
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
            bookings.map((booking) => (
              <ListItem
                key={booking._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#3a3d56",
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 2,
                  border: "1px solid #FFD700",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.02)", background: "#43465a" },
                }}
              >
                <Box>
                  <Typography fontWeight="bold" sx={{ color: "#FFD700" }}>
                    🎬 {booking.movie.title}
                  </Typography>
                  <Typography>🎟 Seats: {booking.seatNumbers.join(", ")}</Typography>
                  <Typography>📅 {new Date(booking.date).toDateString()}</Typography>
                </Box>
                <IconButton
                  onClick={() => handleDelete(booking._id)}
                  sx={{ color: "#FFD700", transition: "0.2s", "&:hover": { color: "#FFA500" } }}
                >
                  <DeleteForeverIcon fontSize="large" />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <Typography textAlign="center" opacity={0.8}>
              No bookings yet.
            </Typography>
          )}
        </List>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>Are you sure you want to cancel this booking?</DialogContentText>
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
