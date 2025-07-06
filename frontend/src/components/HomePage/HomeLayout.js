import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import { getAllMovies } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";

const HomeLayout = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMovies()
      .then((response) => {
        // Handle the response structure: { movies: [...] }
        if (response && response.movies && Array.isArray(response.movies)) {
          setMovies(response.movies);
        } else if (Array.isArray(response)) {
          // Fallback: if response is directly an array
          setMovies(response);
        } else {
          console.log("Invalid data structure received:", response);
          setMovies([]);
        }
      })
      .catch((err) => {
        console.log("Error fetching movies:", err);
        setMovies([]);
      });
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ color: "#FFD700", textAlign: "center", mb: 4 }}>
        Welcome to Ticketly
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", textAlign: "center", mb: 3 }}>
        Latest Movies
      </Typography>
      
      <Grid container spacing={3}>
        {movies.slice(0, 6).map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card sx={{ 
              bgcolor: "#2b2d42", 
              color: "#fff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}>
              <CardMedia
                component="img"
                height="200"
                image={movie.posterUrl}
                alt={movie.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#FFD700" }}>
                  {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {movie.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/booking/${movie._id}`)}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#000",
                    "&:hover": { bgcolor: "#FFA500" },
                  }}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {movies.length > 6 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/movies")}
            sx={{
              borderColor: "#FFD700",
              color: "#FFD700",
              "&:hover": { borderColor: "#FFA500", color: "#FFA500" },
            }}
          >
            View All Movies
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HomeLayout;
