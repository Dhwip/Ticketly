import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSclice = createSlice({
  name: "user",
  initialState: { isLoggedIn: false },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      // Clear all user-related localStorage items
      localStorage.removeItem("userId");
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      state.isLoggedIn = false;
    },
  },
});

const adminSlice = createSlice({
  name: "admin",
  initialState: { isLoggedIn: false },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      // Clear all admin-related localStorage items
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      state.isLoggedIn = false;
    },
  },
});

export const userActions = userSclice.actions;
export const adminActions = adminSlice.actions;

const store = configureStore({
  reducer: {
    user: userSclice.reducer,
    admin: adminSlice.reducer,
  },
});

export default store;
