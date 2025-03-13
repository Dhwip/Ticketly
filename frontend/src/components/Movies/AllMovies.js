import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../helpers/api-helpers";
import CradLayout from "../HomePage/CradLayout";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white",
      }}
    >
      {/* Title Section */}
      <Typography
        variant={isSmallScreen ? "h4" : "h3"}
        fontWeight="bold"
        textAlign="center"
        sx={{ color: "#FFD700", letterSpacing: "2px", mb: 2 }}
      >
        Ticketly
      </Typography>

      {/* All Movies Container */}
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: 4,
          borderRadius: 4,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          width: "90%",
          maxWidth: "1200px",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight="bold"
          sx={{ color: "#FFD700", mb: 3 }}
        >
          All Movies
        </Typography>

        {/* Movies Grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
          gap={4}
          padding={2}
        >
          {movies.length > 0 ? (
            movies.map((movie) => (
              <CradLayout
                key={movie._id}
                id={movie._id}
                title={movie.title}
                releaseDate={movie.releaseDate}
                posterUrl={movie.posterUrl}
                description={movie.description}
              />
            ))
          ) : (
            <Typography variant="h6" textAlign="center" sx={{ opacity: 0.8 }}>
              No Movies Available
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AllMovies;
