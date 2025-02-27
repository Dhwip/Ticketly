import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers"; 
import MovieItem from "./MovieItem";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      width="100%"
      margin="auto"
      marginTop={2}
      sx={{
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
        paddingBottom: 4,
      }}
    >
      {/* Title Section */}
      <Box textAlign="center" py={3}>
        <Typography
          variant={isSmallScreen ? "h4" : "h3"}
          fontWeight="bold"
          sx={{ letterSpacing: "2px", color: "#FFD700" }}
        >
          Ticketly
        </Typography>
      </Box>

      {/* All Movies Title */}
      <Box padding={isSmallScreen ? 3 : 5} margin="auto">
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          textAlign="center"
          fontWeight="bold"
          sx={{ color: "#FFD700" }}
        >
          All Movies
        </Typography>
      </Box>

      {/* Movies Grid */}
      <Box
        margin="auto"
        width="90%"
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={4}
        padding={2}
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
          <Typography variant="h6" textAlign="center" width="100%">
            No Movies Available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AllMovies;
