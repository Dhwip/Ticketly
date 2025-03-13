import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom";

const labelStyle = { mt: 1, mb: 1, fontSize: "14px", fontWeight: "bold", color: "#FFD700" };

const AuthForm = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup });
  };

  return (
    <Dialog 
      PaperProps={{ 
        style: { 
          borderRadius: 15, 
          padding: "20px", 
          backgroundColor: "#2b2d42", 
          color: "#fff" 
        } 
      }} 
      open={true}
    >
      {/* Close Button */}
      <Box sx={{ ml: "auto", padding: 1 }}>
        <IconButton 
          LinkComponent={Link} 
          to="/" 
          sx={{ color: "#FFD700", transition: "0.2s", "&:hover": { color: "#FFA500" } }}
        >
          <CloseRoundedIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Form Heading */}
      <Typography 
        variant="h4" 
        textAlign="center" 
        fontWeight="bold" 
        sx={{ color: "#FFD700", mb: 2 }}
      >
        {isSignup ? "Create an Account" : "Welcome Back"}
      </Typography>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box
          padding={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width={380}
          margin="auto"
        >
          {/* Name Field (Only for Signup) */}
          {!isAdmin && isSignup && (
            <>
              <FormLabel sx={labelStyle}>Full Name</FormLabel>
              <TextField
                value={inputs.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="text"
                name="name"
                sx={{ mb: 2, bgcolor: "#3a3d56", borderRadius: "5px", input: { color: "#fff" } }}
              />
            </>
          )}

          {/* Email Field */}
          <FormLabel sx={labelStyle}>Email Address</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            type="email"
            name="email"
            sx={{ mb: 2, bgcolor: "#3a3d56", borderRadius: "5px", input: { color: "#fff" } }}
          />

          {/* Password Field */}
          <FormLabel sx={labelStyle}>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            type="password"
            name="password"
            sx={{ mb: 2, bgcolor: "#3a3d56", borderRadius: "5px", input: { color: "#fff" } }}
          />

          {/* Submit Button */}
          <Button
            sx={{
              mt: 2,
              borderRadius: 8,
              bgcolor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              width: "100%",
              padding: "10px",
              "&:hover": { bgcolor: "#FFA500" },
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>

          {/* Switch to Signup/Login */}
          {!isAdmin && (
            <Button
              onClick={() => setIsSignup(!isSignup)}
              sx={{
                mt: 2,
                borderRadius: 8,
                color: "#FFD700",
                fontWeight: "bold",
                textDecoration: "underline",
                "&:hover": { color: "#FFA500" },
              }}
              fullWidth
            >
              {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </Button>
          )}
        </Box>
      </form>
    </Dialog>
  );
};

export default AuthForm;
