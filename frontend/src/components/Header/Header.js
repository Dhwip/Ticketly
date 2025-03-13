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
import { getAllMovies } from "../../helpers/api-helpers";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/user-slice";
import { adminActions } from "../../store/admin-slice";

const Header = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(false);
  const [data, setData] = useState([]);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMovies()
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e, val) => {
    const movie = data.find((mov) => mov.title === val);
    if (movie && isUserLoggedIn) {
      navigate(`/booking/${movie._id}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1c1c1c", paddingY: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <MovieCreationIcon fontSize="large" sx={{ color: "#FFD700" }} />
          </Link>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#FFD700", ml: 1 }}
          >
            MovieVerse
          </Typography>
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
          options={data.map((option) => option.title)}
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
            value={value}
            onChange={(e, val) => setValue(val)}
            textColor="inherit"
            indicatorColor="secondary"
            TabIndicatorProps={{ sx: { height: 3, bgcolor: "#FFD700" } }}
          >
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab
                  to="/auth"
                  component={NavLink}
                  label="Auth"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                  }}
                />
                <Tab
                  to="/admin"
                  component={NavLink}
                  label="Admin"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                  }}
                />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab
                  to="/user"
                  component={NavLink}
                  label="User"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                  }}
                />
                <Tab
                  onClick={() => dispatch(userActions.logout())}
                  to="/"
                  component={NavLink}
                  label="Logout"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FF4500" },
                  }}
                />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab
                  to="/profile"
                  component={NavLink}
                  label="Profile"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                  }}
                />
                <Tab
                  to="/add"
                  component={NavLink}
                  label="Add Movie"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FFA500" },
                  }}
                />
                <Tab
                  onClick={() => dispatch(adminActions.logout())}
                  to="/"
                  component={NavLink}
                  label="Logout"
                  sx={{
                    color: "#FFD700",
                    "&:hover": { color: "#FF4500" },
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
