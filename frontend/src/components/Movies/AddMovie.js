import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { addMovie } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
  const [theaters, setTheaters] = useState([{ name: "", location: "", timeSlots: [{ time: "", price: 150 }] }]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem("adminToken");
      const adminId = localStorage.getItem("adminId");
      
      if (!adminToken || !adminId) {
        setSnackbarMessage("Please login as admin to add movies");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

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
    setTheaters([{ name: "", location: "", timeSlots: [{ time: "", price: 150 }] }]);
  };

  const handleTheaterChange = (index, field, value) => {
    const newTheaters = [...theaters];
    newTheaters[index][field] = value;
    setTheaters(newTheaters);
  };

  const handleTimeSlotChange = (theaterIndex, slotIndex, field, value) => {
    const newTheaters = [...theaters];
    newTheaters[theaterIndex].timeSlots[slotIndex][field] = value;
    setTheaters(newTheaters);
  };

  const addTheater = () => {
    setTheaters([...theaters, { name: "", location: "", timeSlots: [{ time: "", price: 150 }] }]);
  };

  const removeTheater = (index) => {
    if (theaters.length > 1) {
      const newTheaters = theaters.filter((_, i) => i !== index);
      setTheaters(newTheaters);
    }
  };

  const addTimeSlot = (theaterIndex) => {
    const newTheaters = [...theaters];
    newTheaters[theaterIndex].timeSlots.push({ time: "", price: 150 });
    setTheaters(newTheaters);
  };

  const removeTimeSlot = (theaterIndex, slotIndex) => {
    const newTheaters = [...theaters];
    if (newTheaters[theaterIndex].timeSlots.length > 1) {
      newTheaters[theaterIndex].timeSlots = newTheaters[theaterIndex].timeSlots.filter((_, i) => i !== slotIndex);
      setTheaters(newTheaters);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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

      // Validate theaters and time slots
      for (const theater of theaters) {
        if (!theater.name.trim() || !theater.location.trim()) {
          setSnackbarMessage("Please fill in all theater details");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          return;
        }
        for (const slot of theater.timeSlots) {
          if (!slot.time.trim() || !slot.price || slot.price <= 0) {
            setSnackbarMessage("Please fill in all time slot details");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
          }
        }
      }

      // Format the data properly
      const movieData = {
        title: inputs.title.trim(),
        description: inputs.description.trim(),
        posterUrl: inputs.posterUrl.trim(),
        releaseDate: new Date(inputs.releaseDate).toISOString(),
        featured: inputs.featured,
        language: inputs.language.trim(),
        actors: actors.map(actor => actor.trim()),
        theaters: theaters.map(theater => ({
          name: theater.name.trim(),
          location: theater.location.trim(),
          timeSlots: theater.timeSlots.map(slot => ({
            time: slot.time.trim(),
            price: Number(slot.price)
          }))
        }))
      };

      console.log("Submitting movie data:", movieData);

      const res = await addMovie(movieData);
      
      if (res.movie) {
        setSnackbarMessage("Movie added successfully! Redirecting to admin profile...");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        resetForm();
        setTimeout(() => {
          navigate("/user-admin");
        }, 2000);
      }
    } catch (err) {
      console.error("Error adding movie:", err);
      setSnackbarMessage(err.message || "Failed to add movie. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      
      if (err.message.includes("Invalid or expired session")) {
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ color: "#FFD700" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

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
          maxWidth: "800px",
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

          {/* Theaters Section */}
          <Typography variant="h6" sx={{ color: "#FFD700", mt: 3, mb: 2 }}>
            Theaters & Time Slots
          </Typography>

          {theaters.map((theater, theaterIndex) => (
            <Paper
              key={theaterIndex}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#1a1a1a",
                border: "1px solid #FFD700",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography sx={{ color: "#FFD700" }}>
                  Theater {theaterIndex + 1}
                </Typography>
                {theaters.length > 1 && (
                  <IconButton
                    onClick={() => removeTheater(theaterIndex)}
                    sx={{ color: "#FFD700" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={labelProps}>Theater Name</FormLabel>
                  <TextField
                    value={theater.name}
                    onChange={(e) => handleTheaterChange(theaterIndex, "name", e.target.value)}
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={labelProps}>Location</FormLabel>
                  <TextField
                    value={theater.location}
                    onChange={(e) => handleTheaterChange(theaterIndex, "location", e.target.value)}
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
                </Grid>
              </Grid>

              {/* Time Slots */}
              <Box mt={2}>
                <Typography sx={{ color: "#FFD700", mb: 1 }}>
                  Time Slots
                </Typography>
                {theater.timeSlots.map((slot, slotIndex) => (
                  <Paper
                    key={slotIndex}
                    sx={{
                      p: 2,
                      mb: 1,
                      bgcolor: "#2b2d42",
                      border: "1px solid #FFD700",
                      borderRadius: 1,
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <FormLabel sx={labelProps}>Time</FormLabel>
                        <TextField
                          type="time"
                          value={slot.time}
                          onChange={(e) => handleTimeSlotChange(theaterIndex, slotIndex, "time", e.target.value)}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            input: { color: "#fff" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#FFD700" },
                              "&:hover fieldset": { borderColor: "#FFA500" },
                              "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <FormLabel sx={labelProps}>Price (₹)</FormLabel>
                        <TextField
                          type="number"
                          value={slot.price}
                          onChange={(e) => handleTimeSlotChange(theaterIndex, slotIndex, "price", Number(e.target.value))}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          InputProps={{ inputProps: { min: 0 } }}
                          sx={{
                            input: { color: "#fff" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#FFD700" },
                              "&:hover fieldset": { borderColor: "#FFA500" },
                              "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        {theater.timeSlots.length > 1 && (
                          <IconButton
                            onClick={() => removeTimeSlot(theaterIndex, slotIndex)}
                            sx={{ color: "#FFD700", mt: 2 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addTimeSlot(theaterIndex)}
                  sx={{
                    mt: 1,
                    color: "#FFD700",
                    borderColor: "#FFD700",
                    "&:hover": {
                      borderColor: "#FFA500",
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                    },
                  }}
                >
                  Add Time Slot
                </Button>
              </Box>
            </Paper>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addTheater}
            sx={{
              mt: 2,
              color: "#FFD700",
              borderColor: "#FFD700",
              "&:hover": {
                borderColor: "#FFA500",
                backgroundColor: "rgba(255, 215, 0, 0.1)",
              },
            }}
          >
            Add Theater
          </Button>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 3,
              backgroundColor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#FFA500" },
              "&.Mui-disabled": { backgroundColor: "#666" },
            }}
          >
            {isSubmitting ? "Adding Movie..." : "🎬 Add Movie"}
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
