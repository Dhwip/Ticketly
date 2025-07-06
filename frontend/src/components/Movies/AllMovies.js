import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AllMovies = () => {
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
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => navigate(`/booking/${movie._id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={movie.posterUrl}
                alt={movie.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllMovies;
