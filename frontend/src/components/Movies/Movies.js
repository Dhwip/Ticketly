import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers"; 
import MovieItem from "./MovieItem";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
        py: 4,
        px: 2,
      }}
    >
      {/* Title Section */}
      <Box textAlign="center" mb={3}>
        <Typography
          variant={isSmallScreen ? "h4" : "h3"}
          fontWeight="bold"
          sx={{ letterSpacing: "2px", color: "#FFD700" }}
        >
          Ticketly
        </Typography>
      </Box>

      {/* All Movies Title */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight="bold"
          sx={{ color: "#FFD700" }}
        >
          All Movies
        </Typography>
      </Box>

      {/* Movies Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          px: 2,
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <MovieItem
              key={index}
              id={movie._id}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              title={movie.title}
            />
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%", opacity: 0.8 }}>
            No Movies Available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AllMovies;
