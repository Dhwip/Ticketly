import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import { getAllMovies } from "../../api-helpers/api-helpers";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions, adminActions } from "../../store";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMovies()
      .then((response) => {
        // Handle the response structure: { movies: [...] }
        if (response && response.movies && Array.isArray(response.movies)) {
          setData(response.movies);
        } else if (Array.isArray(response)) {
          // Fallback: if response is directly an array
          setData(response);
        } else {
          console.log("Invalid data structure received:", response);
          setData([]);
        }
      })
      .catch((err) => {
        console.log("Error fetching movies:", err);
        setData([]);
      });
  }, []);

  // Update tab value based on current location
  useEffect(() => {
    if (location.pathname === "/") {
      setTabValue(0);
    } else if (location.pathname === "/auth") {
      setTabValue(1);
    } else if (location.pathname === "/admin") {
      setTabValue(2);
    } else if (location.pathname === "/user") {
      setTabValue(1);
    } else if (location.pathname === "/user-admin") {
      setTabValue(1);
    } else if (location.pathname === "/add") {
      setTabValue(2);
    } else {
      setTabValue(0);
    }
  }, [location.pathname]);

  const handleChange = (e, val) => {
    const movie = data.find((mov) => mov.title === val);
    if (movie && isUserLoggedIn) {
      navigate(`/booking/${movie._id}`);
    }
  };

  const handleUserLogout = () => {
    dispatch(userActions.logout());
    navigate("/", { replace: true });
  };

  const handleAdminLogout = () => {
    // Clear all admin-related localStorage items
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    dispatch(adminActions.logout());
    navigate("/", { replace: true });
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1c1c1c", paddingY: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <MovieCreationIcon fontSize="large" sx={{ color: "#FFD700" }} />
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ 
                color: "#FFD700", 
                ml: 1,
                cursor: "pointer",
                "&:hover": { color: "#FFA500" }
              }}
            >
              Ticketly
            </Typography>
          </Link>
        </Box>

        {/* Search Bar */}
        <Autocomplete
          onChange={handleChange}
          sx={{
            width: "40%",
            bgcolor: "#2b2d42",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              color: "#FFD700",
              "& fieldset": { borderColor: "#FFD700" },
              "&:hover fieldset": { borderColor: "#FFA500" },
              "&.Mui-focused fieldset": { borderColor: "#FFD700" },
            },
          }}
          freeSolo
          options={Array.isArray(data) ? data.map((option) => option.title) : []}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Movies..."
              variant="outlined"
              sx={{
                input: { color: "#FFD700" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#FFD700" },
                  "&:hover fieldset": { borderColor: "#FFA500" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                },
              }}
            />
          )}
        />

        {/* Navigation Tabs */}
        <Box>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            TabIndicatorProps={{ sx: { height: 3, bgcolor: "#FFD700" } }}
          >
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab
                  value={1}
                  to="/auth"
                  component={NavLink}
                  label="Auth"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                    "&.Mui-selected": { color: "#FFD700" },
                  }}
                />
                <Tab
                  value={2}
                  to="/admin"
                  component={NavLink}
                  label="Admin"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                    "&.Mui-selected": { color: "#FFD700" },
                  }}
                />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab
                  value={1}
                  to="/user"
                  component={NavLink}
                  label="User"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                    "&.Mui-selected": { color: "#FFD700" },
                  }}
                />
                <Tab
                  value={2}
                  onClick={handleUserLogout}
                  label="Logout"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FF4500" },
                    "&.Mui-selected": { color: "#FFD700" },
                    cursor: "pointer",
                  }}
                />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab
                  value={1}
                  to="/user-admin"
                  component={NavLink}
                  label="Profile"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                    "&.Mui-selected": { color: "#FFD700" },
                  }}
                />
                <Tab
                  value={2}
                  to="/add"
                  component={NavLink}
                  label="Add Movie"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                    "&.Mui-selected": { color: "#FFD700" },
                  }}
                />
                <Tab
                  value={3}
                  onClick={handleAdminLogout}
                  label="Logout"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FF4500" },
                    "&.Mui-selected": { color: "#FFD700" },
                    cursor: "pointer",
                  }}
                />
              </>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
