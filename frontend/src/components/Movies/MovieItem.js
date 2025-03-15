import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const MovieItem = ({ title, releaseDate, posterUrl, id, language }) => {
  console.log("MovieItem ID:", id);
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
          LinkComponent={Link}
          to={`/booking/${id}`}
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
    </Card>
  );
};

export default MovieItem;
