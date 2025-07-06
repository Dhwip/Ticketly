import { Box, Typography, Grid, Avatar, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getAdminById } from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminMovieCard from "../components/Admin/AdminMovieCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = () => {
    getAdminById()
      .then((res) => setAdmin(res.admin))
      .catch(console.error);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await axios.delete(`http://localhost:9000/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        // Refresh admin data to update the movies list
        fetchAdminData();
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie");
    }
  };

  const handleBackToHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1c1c1c, #2b2d42)",
        color: "#fff",
      }}
    >
      {admin && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#2b2d42",
            padding: 4,
            borderRadius: 4,
            width: "350px",
            textAlign: "center",
            border: "2px solid #FFD700",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
            marginBottom: 4
          }}
        >
          <Avatar sx={{ width: 100, height: 100, backgroundColor: "#FFD700", mb: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 80, color: "#000" }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">{admin.name}</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>{admin.email}</Typography>
          <Button
            variant="contained"
            onClick={handleBackToHome}
            sx={{
              mt: 2,
              bgcolor: "#FFD700",
              color: "#000",
              "&:hover": { bgcolor: "#FFA500" },
            }}
          >
            Back to Home
          </Button>
        </Box>
      )}

      {admin && admin.addedMovies.length > 0 && (
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            background: "#2b2d42",
            borderRadius: 3,
            padding: 3,
            border: "2px solid #FFD700",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            mb={4}
            sx={{ color: "#FFD700" }}
          >
            🎬 Added Movies
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {admin.addedMovies.map((movie) => (
              <Grid item key={movie._id}>
                <AdminMovieCard
                  id={movie._id}
                  title={movie.title}
                  description={movie.description}
                  posterUrl={movie.posterUrl}
                  onDelete={() => handleDeleteMovie(movie._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AdminProfile;
