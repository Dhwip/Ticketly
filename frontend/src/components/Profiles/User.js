import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { DeleteForeverOutlined } from "@mui/icons-material/";
import { IconButton, List, ListItem, ListItemText, Typography, Dialog, DialogActions, DialogTitle, Button, CircularProgress } from "@mui/material";
import { deleteBooking, getUserBookings } from "../../helpers/api-helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = () => {
  const [bookings, setBookings] = useState([]);
  const [deleteId, setDeleteId] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [openDialog, setOpenDialog] = useState(false); 

  useEffect(() => {
    getUserBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    deleteBooking(deleteId)
      .then(() => {
        toast.success("Booking deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== deleteId));
      })
      .catch(() => {
        toast.error("Failed to delete booking.");
      })
      .finally(() => {
        setLoading(false);
        setOpenDialog(false);
      });
  };

  return (
    <Box width="100%" display={"flex"} flexDirection={{ xs: "column", md: "row" }} padding={2}>
      {/* User Profile Section */}
      <Box display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"} width={{ xs: "100%", md: "30%" }} padding={2}>
        <PersonRoundedIcon sx={{ fontSize: "15rem", color: "#1976d2" }} />
        <Typography
          padding={1}
          width="150px"
          textAlign={"center"}
          border="1px solid #ccc"
          borderRadius={10}
          fontWeight="bold"
          bgcolor="#f5f5f5"
        >
          {bookings.length > 0 ? `Name: ${bookings[0].user.name}` : "No User Found"}
        </Typography>
      </Box>

      {/* Booking List Section */}
      <Box width={{ xs: "100%", md: "70%" }} display="flex" flexDirection={"column"} padding={2}>
        <Typography variant="h4" fontFamily={"Verdana"} textAlign="center" padding={2} fontWeight="bold">
          Your Bookings
        </Typography>
        
        {bookings.length > 0 ? (
          <List sx={{ width: "90%", margin: "auto", bgcolor: "white", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            {bookings.map((booking, index) => (
              <ListItem
                sx={{
                  bgcolor: "#f5f5f5",
                  color: "black",
                  textAlign: "center",
                  margin: "8px 0",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
                key={index}
              >
                <ListItemText primary={`Movie: ${booking.movie.title}`} secondary={`Seat: ${booking.seatNumber} | Date: ${new Date(booking.date).toDateString()}`} />

                <IconButton
                  onClick={() => {
                    setDeleteId(booking._id);
                    setOpenDialog(true);
                  }}
                  color="error"
                  disabled={loading}
                >
                  {loading && deleteId === booking._id ? <CircularProgress size={24} /> : <DeleteForeverOutlined />}
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography textAlign="center" color="gray" fontSize="1.2rem" padding={3}>
            No bookings found. Book your favorite movies now!
          </Typography>
        )}
      </Box>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;
