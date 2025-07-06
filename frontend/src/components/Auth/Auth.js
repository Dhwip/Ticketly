import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendUserAuthRequest } from "../../api-helpers/api-helpers.js";
import { userActions } from "../../store";
import AuthForm from "./AuthForm.js";
import { Snackbar, Alert } from "@mui/material";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ open: false, text: "", severity: "success" });

  const onResReceived = (data) => {
    console.log(data);
    dispatch(userActions.login());
    localStorage.setItem("userId", data.id);
    // Use replace instead of push to prevent going back to auth page
    navigate("/", { 
      replace: true,
      state: { 
        showSuccessMessage: true,
        message: "Successfully logged in!"
      }
    });
  };

  const handleCloseMessage = () => {
    setMessage({ open: false, text: "", severity: "success" });
  };

  const getData = (data) => {
    console.log(data);
    sendUserAuthRequest(data.inputs, data.signup)
      .then(onResReceived)
      .catch((err) => {
        console.log(err);
        let errorMessage = "An error occurred. Please try again.";
        
        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = "Invalid email or password";
              break;
            case 404:
              errorMessage = "User not found";
              break;
            case 400:
              errorMessage = err.response.data.message || "Invalid input";
              break;
            default:
              errorMessage = err.response.data.message || "Server error";
          }
        }
        
        setMessage({ 
          open: true, 
          text: errorMessage, 
          severity: "error" 
        });
      });
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseMessage} 
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;
