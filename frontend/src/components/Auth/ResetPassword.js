import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../../api-helpers/api-helpers.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ show: false, text: "", severity: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyResetToken(token);
        setIsValidToken(true);
      } catch (err) {
        setMessage({ 
          show: true, 
          text: "Invalid or expired reset link. Please request a new password reset.", 
          severity: "error" 
        });
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setMessage({ 
        show: true, 
        text: "Invalid reset link. Please request a new password reset.", 
        severity: "error" 
      });
      setIsValidToken(false);
      setIsVerifying(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.trim() === "") {
      setMessage({ show: true, text: "Please enter a new password", severity: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ show: true, text: "Password must be at least 6 characters long", severity: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ show: true, text: "Passwords do not match", severity: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setMessage({ 
        show: true, 
        text: "Password has been reset successfully! You can now login with your new password.", 
        severity: "success" 
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
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

  const handleClose = () => {
    navigate("/auth");
  };

  if (isVerifying) {
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
        <Box sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#FFD700" }}>
            Verifying reset link...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  if (!isValidToken) {
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
        <Box sx={{ ml: "auto", padding: 1 }}>
          <IconButton 
            onClick={handleClose}
            sx={{ color: "#FFD700", transition: "0.2s", "&:hover": { color: "#FFA500" } }}
          >
            <CloseRoundedIcon fontSize="large" />
          </IconButton>
        </Box>

        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight="bold" 
          sx={{ color: "#FFD700", mb: 2 }}
        >
          Invalid Reset Link
        </Typography>

        {message.show && (
          <Alert 
            severity={message.severity} 
            onClose={handleCloseMessage}
            sx={{ mb: 2, bgcolor: message.severity === "success" ? "#4caf50" : "#f44336" }}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ padding: 4, textAlign: "center" }}>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: 8,
              bgcolor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              padding: "10px 20px",
              "&:hover": { bgcolor: "#FFA500" },
            }}
            variant="contained"
          >
            Go to Login
          </Button>
        </Box>
      </Dialog>
    );
  }

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
          onClick={handleClose}
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
        Reset Password
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
            Enter your new password below.
          </Typography>

          {/* New Password Field */}
          <FormLabel sx={{ mt: 1, mb: 1, fontSize: "14px", fontWeight: "bold", color: "#FFD700" }}>
            New Password
          </FormLabel>
          <TextField
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            type="password"
            name="newPassword"
            sx={{ mb: 2, bgcolor: "#3a3d56", borderRadius: "5px", input: { color: "#fff" } }}
          />

          {/* Confirm Password Field */}
          <FormLabel sx={{ mt: 1, mb: 1, fontSize: "14px", fontWeight: "bold", color: "#FFD700" }}>
            Confirm New Password
          </FormLabel>
          <TextField
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            variant="outlined"
            type="password"
            name="confirmPassword"
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
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          {/* Back to Login */}
          <Button
            onClick={handleClose}
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

export default ResetPassword; 