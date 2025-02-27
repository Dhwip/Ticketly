import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../helpers/api-helpers";
import CradLayout from "../HomePage/CradLayout";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box margin="auto" marginTop={4} width="90%">
      <Typography variant="h4" padding={2} textAlign="center" fontWeight="bold" color="primary">
        All Movies
      </Typography>
      <Box
        margin="auto"
        width="100%"
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
          <Typography variant="h6" textAlign="center" width="100%">
            No Movies Available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AllMovies;
