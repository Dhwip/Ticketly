import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendAdminAuthRequest } from "../../api-helpers/api-helpers.js";
import { adminActions } from "../../store";
import AuthForm from "./AuthForm.js";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onResReceived = (data) => {
    console.log(data);
    dispatch(adminActions.login());
    localStorage.setItem("adminId", data.id);
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("token", data.token);
    // Use replace instead of push to prevent going back to admin login page
    navigate("/", { replace: true });
  };
  
  const getData = (data) => {
    console.log("Admin", data);
    sendAdminAuthRequest(data.inputs)
      .then(onResReceived)
      .catch((err) => console.log(err));
  };
  
  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={true} />
    </div>
  );
};

export default Admin;
