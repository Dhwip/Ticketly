import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieItem = ({ title, releaseDate, posterUrl, id, language }) => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'warning'
  });

  const handleBookNow = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    console.log("Auth check - userId:", userId); // Debug log
    
    if (!userId) {
      console.log("User not authenticated, redirecting to auth"); // Debug log
      setSnackbar({
        open: true,
        message: 'Please login to book tickets',
        severity: 'warning'
      });
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
      return;
    }

    // User is authenticated, navigate to booking page
    console.log("User authenticated, navigating to booking page"); // Debug log
    navigate(`/booking/${id}`);
  };

  return (
    <Card
      sx={{
        width: 250,
        height: 380,
        margin: 2,
        borderRadius: 5,
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img height={"50%"} width="100%" src={posterUrl} alt={title} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ 
            fontSize: "1.2rem",
            fontWeight: "bold",
            maxWidth: "70%"
          }}>
            {title}
          </Typography>
          {language && (
            <Chip
              label={language}
              size="small"
              sx={{
                backgroundColor: "#FFD700",
                color: "#000",
                fontWeight: "bold",
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Release Date: {new Date(releaseDate).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleBookNow}
          sx={{
            margin: "auto",
            bgcolor: "#2b2d42",
            ":hover": {
              bgcolor: "#121217",
            },
            width: "80%",
          }}
        >
          Book Now
        </Button>
      </CardActions>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: '500'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MovieItem;
