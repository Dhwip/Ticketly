import { Box, Typography, List, ListItem, ListItemText, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { getAdminById } from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    getAdminById()
      .then((res) => setAdmin(res.admin))
      .catch(console.error);
  }, []);

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
          }}
        >
          <Avatar sx={{ width: 100, height: 100, backgroundColor: "#FFD700", mb: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 80, color: "#000" }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">{admin.name}</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>{admin.email}</Typography>
        </Box>
      )}

      {admin && admin.addedMovies.length > 0 && (
        <Box
          sx={{
            mt: 4,
            width: "85%",
            maxWidth: "800px",
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
            mb={2}
            sx={{ color: "#FFD700" }}
          >
            🎬 Added Movies
          </Typography>

          <List>
            {admin.addedMovies.map((movie, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#3a3d56",
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 2,
                  border: "1px solid #FFD700",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.02)", background: "#43465a" },
                }}
              >
                <ListItemText primary={`🎥 ${movie.title}`} sx={{ color: "#FFD700" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default AdminProfile;
