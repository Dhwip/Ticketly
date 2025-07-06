    import express from "express";
    import {
      deleteUser,
      getAllUsers,
      getBookingsOfUser,
      getUserById,
      login,
      singup,
      updateUser,
      requestPasswordReset,
      resetPassword,
      verifyResetToken,
    } from "../controllers/user-controller.js";

    const userRouter = express.Router();

    userRouter.get("/", getAllUsers);
    userRouter.get("/:id", getUserById);
    userRouter.post("/signup", singup);
    userRouter.put("/:id", updateUser);
    userRouter.delete("/:id", deleteUser);
    userRouter.post("/login", login);
    userRouter.get("/bookings/:id", getBookingsOfUser);

    // Password reset routes
    userRouter.post("/forgot-password", requestPasswordReset);
    userRouter.post("/reset-password", resetPassword);
    userRouter.get("/verify-reset-token/:token", verifyResetToken);

    export default userRouter;
