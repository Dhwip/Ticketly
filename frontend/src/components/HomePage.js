import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllMovies } from "../api-helpers/api-helpers";
import MovieItem from "./Movies/MovieItem";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const sliderSettings = {
    infinite: true,
    speed: 800, 
    slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 3 : 5, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.65, 0.05, 0.36, 1)",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <Box
      width="100%"
      height="100%"
      margin="auto"
      marginTop={2}
      sx={{
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
        paddingBottom: 4
      }}
    >
      {/* Title Section */}
      <Box textAlign="center" py={3}>
        <Typography variant={isSmallScreen ? "h4" : "h3"} fontWeight="bold" sx={{ letterSpacing: "2px", color: "#FFD700" }}>
          Ticketly
        </Typography>
      </Box>

      {/* Trailer Section */}
      <Box
        margin="auto"
        width={isSmallScreen ? "95%" : "90%"}
        height={isSmallScreen ? "40vh" : "60vh"}
        padding={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#000"
        borderRadius={3}
        boxShadow={5}
      >
        <video
          width="100%"
          height="100%"
          controls
          style={{
            borderRadius: "12px",
            boxShadow: "0px 8px 20px rgba(255, 215, 0, 0.3)",
            objectFit: "cover"
          }}
        >
          <source src="/trailer.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>

      {/* Latest Releases Title */}
      <Box padding={isSmallScreen ? 3 : 5} margin="auto">
        <Typography variant={isSmallScreen ? "h5" : "h4"} textAlign="center" fontWeight="bold" sx={{ color: "#FFD700" }}>
          Latest Releases
        </Typography>
      </Box>

      {/* Movie Slider */}
      <Box width={isSmallScreen ? "95%" : "80%"} margin="auto">
        <Slider {...sliderSettings}>
          {movies &&
            movies.map((movie, index) => (
              <MovieItem
                id={movie._id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                releaseDate={movie.releaseDate}
                key={index}
              />
            ))}
        </Slider>
      </Box>

      {/* View All Movies Button */}
      <Box display="flex" padding={isSmallScreen ? 3 : 5} margin="auto">
        <Button
          LinkComponent={Link}
          to="/movies"
          variant="contained"
          sx={{
            margin: "auto",
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#000",
            padding: isSmallScreen ? "8px 14px" : "12px 24px",
            fontSize: isSmallScreen ? "14px" : "18px",
            borderRadius: "30px",
            fontWeight: "bold",
            boxShadow: "0px 5px 15px rgba(255, 215, 0, 0.5)",
            "&:hover": {
              background: "#FFA500",
              boxShadow: "0px 5px 20px rgba(255, 165, 0, 0.8)"
            }
          }}
        >
          View All Movies
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
