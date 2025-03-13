import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addMovie } from "../../api-helpers/api-helpers";

const labelProps = {
  mt: 1,
  mb: 1,
  color: "#FFD700",
};

const AddMovie = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
  });

  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs, actors);
    addMovie({ ...inputs, actors })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
        padding: 4,
      }}
    >
      <Box
        sx={{
          width: "85%",
          maxWidth: "600px",
          background: "#2b2d42",
          padding: 4,
          borderRadius: 3,
          border: "2px solid #FFD700",
          boxShadow: "0px 0px 10px rgba(255, 215, 0, 0.3)",
          textAlign: "center",
          transition: "transform 0.2s ease-in-out",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#FFD700" }}>
          🎬 Add New Movie
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormLabel sx={labelProps}>Title</FormLabel>
          <TextField
            value={inputs.title}
            onChange={handleChange}
            name="title"
            variant="outlined"
            margin="dense"
            fullWidth
            InputProps={{ style: { color: "#FFD700", borderColor: "#FFD700" } }}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FFD700" },
                "&:hover fieldset": { borderColor: "#FFA500" },
                "&.Mui-focused fieldset": { borderColor: "#FFD700" },
              },
            }}
          />

          <FormLabel sx={labelProps}>Description</FormLabel>
          <TextField
            value={inputs.description}
            onChange={handleChange}
            name="description"
            variant="outlined"
            margin="dense"
            fullWidth
            multiline
            rows={3}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FFD700" },
                "&:hover fieldset": { borderColor: "#FFA500" },
                "&.Mui-focused fieldset": { borderColor: "#FFD700" },
              },
            }}
          />

          <FormLabel sx={labelProps}>Poster URL</FormLabel>
          <TextField
            value={inputs.posterUrl}
            onChange={handleChange}
            name="posterUrl"
            variant="outlined"
            margin="dense"
            fullWidth
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FFD700" },
                "&:hover fieldset": { borderColor: "#FFA500" },
                "&.Mui-focused fieldset": { borderColor: "#FFD700" },
              },
            }}
          />

          <FormLabel sx={labelProps}>Release Date</FormLabel>
          <TextField
            type="date"
            value={inputs.releaseDate}
            onChange={handleChange}
            name="releaseDate"
            variant="outlined"
            margin="dense"
            fullWidth
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FFD700" },
                "&:hover fieldset": { borderColor: "#FFA500" },
                "&.Mui-focused fieldset": { borderColor: "#FFD700" },
              },
            }}
          />

          <FormLabel sx={labelProps}>Actors</FormLabel>
          <Box display="flex" alignItems="center">
            <TextField
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              variant="outlined"
              margin="dense"
              fullWidth
              sx={{
                input: { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#FFD700" },
                  "&:hover fieldset": { borderColor: "#FFA500" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                },
              }}
            />
            <Button
              onClick={() => {
                if (actor.trim()) {
                  setActors([...actors, actor]);
                  setActor("");
                }
              }}
              sx={{
                ml: 2,
                backgroundColor: "#FFD700",
                color: "#000",
                "&:hover": { backgroundColor: "#FFA500" },
              }}
            >
              Add
            </Button>
          </Box>

          {actors.length > 0 && (
            <Typography sx={{ color: "#FFD700", mt: 1 }}>
              Added Actors: {actors.join(", ")}
            </Typography>
          )}

          <FormLabel sx={labelProps}>Featured</FormLabel>
          <Checkbox
            name="featured"
            checked={inputs.featured}
            onChange={(e) =>
              setInputs((prevState) => ({
                ...prevState,
                featured: e.target.checked,
              }))
            }
            sx={{
              color: "#FFD700",
              "&.Mui-checked": { color: "#FFD700" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#FFA500" },
            }}
          >
            🎬 Add Movie
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddMovie;
