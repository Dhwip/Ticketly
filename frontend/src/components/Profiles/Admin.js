import React, { useEffect, useState } from "react";
import { getAdminData } from "../../api-helpers/api-helpers";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminData()
      .then((data) => setAdmin(data))
      .catch((err) => console.log(err));
  }, []);

  if (!admin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#FFD700" }}>
        Admin Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#2b2d42", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#FFD700" }}>
                Admin Information
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {admin.email}
              </Typography>
              <Typography variant="body1">
                <strong>ID:</strong> {admin._id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#2b2d42", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#FFD700" }}>
                Actions
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/add")}
                sx={{
                  bgcolor: "#FFD700",
                  color: "#000",
                  "&:hover": { bgcolor: "#FFA500" },
                  mr: 2,
                }}
              >
                Add Movie
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  borderColor: "#FFD700",
                  color: "#FFD700",
                  "&:hover": { borderColor: "#FFA500", color: "#FFA500" },
                }}
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin;
