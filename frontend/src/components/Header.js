import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { getAllMovies } from "../api-helpers/api-helpers";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [movies, setMovies] = useState([]);
  const [value, setValue] = useState(false);

  // Fetch movies for search
  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  // Update active tab based on route
  useEffect(() => {
    if (location.pathname === "/") setValue(false);
    else if (location.pathname === "/movies") setValue(0);
    else if (location.pathname === "/admin") setValue(1);
    else if (location.pathname === "/auth") setValue(2);
    else if (location.pathname === "/user") setValue(3);
    else if (location.pathname === "/add") setValue(4);
    else if (location.pathname === "/user-admin") setValue(5);
    else setValue(false);
  }, [location.pathname]);

  // Handle movie search selection
  const handleSearchChange = (event, val) => {
    const movie = movies.find((m) => m.title === val);
    if (isUserLoggedIn && movie) {
      navigate(`/booking/${movie._id}`);
    }
  };

  // Handle logout
  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1c1c1c", paddingY: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/"
            onClick={() => setValue(false)}
            sx={{ color: value === false ? "#FFA500" : "#FFD700" }}
          >
            <MovieIcon fontSize="large" />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#FFD700", ml: 1 }}
          >
            Ticketly
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box width={"40%"}>
          <Autocomplete
            onChange={handleSearchChange}
            freeSolo
            options={movies.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Movies..."
                variant="outlined"
                sx={{
                  bgcolor: "#2b2d42",
                  borderRadius: 2,
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
        </Box>

        {/* Navigation Tabs */}
        <Box>
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            value={value}
            onChange={(e, val) => setValue(val)}
            TabIndicatorProps={{ sx: { height: 3, bgcolor: "#FFD700" } }}
          >
            <Tab value={0} component={Link} to="/movies" label="Movies" sx={tabStyle} />
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab value={1} component={Link} to="/admin" label="Admin" sx={tabStyle} />
                <Tab value={2} component={Link} to="/auth" label="Auth" sx={tabStyle} />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab value={3} component={Link} to="/user" label="Profile" sx={tabStyle} />
                <Tab value={6} onClick={() => logout(false)} label="Logout" sx={logoutStyle} />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab value={4} component={Link} to="/add" label="Add Movie" sx={tabStyle} />
                <Tab value={5} component={Link} to="/user-admin" label="Profile" sx={tabStyle} />
                <Tab value={7} onClick={() => logout(true)} label="Logout" sx={logoutStyle} />
              </>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Styles
const tabStyle = {
  color: "#FFD700",
  "&:hover": { color: "#FFA500" },
};

const logoutStyle = {
  color: "#FFD700",
  "&:hover": { color: "#FF4500" },
};

export default Header;
