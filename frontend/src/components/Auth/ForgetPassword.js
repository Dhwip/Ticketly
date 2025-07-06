import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom";
import { sendPasswordResetRequest } from "../../api-helpers/api-helpers.js";

const ForgetPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ show: false, text: "", severity: "success" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || email.trim() === "") {
      setMessage({ show: true, text: "Please enter your email address", severity: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetRequest(email);
      setMessage({ 
        show: true, 
        text: "If an account with that email exists, a password reset link has been sent to your email.", 
        severity: "success" 
      });
      setEmail("");
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setMessage({ show: true, text: errorMessage, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage({ show: false, text: "", severity: "success" });
  };

  return (
    <Dialog 
      PaperProps={{ 
        style: { 
          borderRadius: 15, 
          padding: "20px", 
          backgroundColor: "#2b2d42", 
          color: "#fff",
          minWidth: "400px"
        } 
      }} 
      open={true}
    >
      {/* Close Button */}
      <Box sx={{ ml: "auto", padding: 1 }}>
        <IconButton 
          onClick={onClose}
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
        Forgot Password
      </Typography>

      {/* Alert Message */}
      {message.show && (
        <Alert 
          severity={message.severity} 
          onClose={handleCloseMessage}
          sx={{ mb: 2, bgcolor: message.severity === "success" ? "#4caf50" : "#f44336" }}
        >
          {message.text}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box
          padding={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
          margin="auto"
        >
          <Typography 
            variant="body1" 
            textAlign="center" 
            sx={{ color: "#fff", mb: 3 }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {/* Email Field */}
          <FormLabel sx={{ mt: 1, mb: 1, fontSize: "14px", fontWeight: "bold", color: "#FFD700" }}>
            Email Address
          </FormLabel>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            type="email"
            name="email"
            sx={{ mb: 3, bgcolor: "#3a3d56", borderRadius: "5px", input: { color: "#fff" } }}
          />

          {/* Submit Button */}
          <Button
            sx={{
              borderRadius: 8,
              bgcolor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              width: "100%",
              padding: "10px",
              "&:hover": { bgcolor: "#FFA500" },
              "&:disabled": { bgcolor: "#666" }
            }}
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Back to Login */}
          <Button
            onClick={onClose}
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
            Back to Login
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default ForgetPassword; 