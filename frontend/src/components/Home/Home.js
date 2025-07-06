import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import MovieList from "../Movies/MovieList";
import { getMovies } from "../../api-helpers/api-helpers";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState({ open: false, text: "", severity: "success" });
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showSuccessMessage) {
      setMessage({
        open: true,
        text: location.state.message,
        severity: "success"
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    getMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const handleCloseMessage = () => {
    setMessage({ open: false, text: "", severity: "success" });
  };

  return (
    <Box>
      <Box margin="auto" marginTop={4}>
        <Typography
          variant="h4"
          padding={2}
          textAlign="center"
          backgroundColor={"#900C3F"}
          color="white"
        >
          All Movies
        </Typography>
      </Box>
      <MovieList movies={movies} />
      <Snackbar 
        open={message.open} 
        autoHideDuration={6000} 
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseMessage} 
          severity={message.severity} 
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home; 