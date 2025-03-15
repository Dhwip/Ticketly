import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import { addMovie } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";

const labelProps = {
  mt: 1,
  mb: 1,
  color: "#FFD700",
};

const AddMovie = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
    language: "",
  });
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setInputs({
      title: "",
      description: "",
      posterUrl: "",
      releaseDate: "",
      featured: false,
      language: "",
    });
    setActors([]);
    setActor("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!inputs.title.trim()) {
      setSnackbarMessage("Please enter a movie title");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!inputs.description.trim()) {
      setSnackbarMessage("Please enter a movie description");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!inputs.posterUrl.trim()) {
      setSnackbarMessage("Please enter a poster URL");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!inputs.releaseDate) {
      setSnackbarMessage("Please select a release date");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (actors.length === 0) {
      setSnackbarMessage("Please add at least one actor");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await addMovie({ ...inputs, actors });
      if (res.movie) {
        setSnackbarMessage("Movie added successfully! Redirecting to admin profile...");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        resetForm();
        // Redirect to admin profile after 2 seconds
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      }
    } catch (err) {
      console.error("Error adding movie:", err);
      setSnackbarMessage(err.message || "Failed to add movie. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#FFD700", mb: 3 }}>
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

          <FormLabel sx={labelProps}>Language</FormLabel>
          <TextField
            value={inputs.language}
            onChange={handleChange}
            name="language"
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="e.g., English, Hindi, Spanish"
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMovie;
