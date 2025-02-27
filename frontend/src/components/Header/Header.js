import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Toolbar,
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
    <AppBar position="sticky" sx={{ bgcolor: "#1e1f26", paddingY: 1 }}>
      <Toolbar>
        <Box flexGrow={1} display="flex" alignItems="center">
          <Link to="/" style={{ color: "white" }}>
            <MovieCreationIcon fontSize="large" />
          </Link>
        </Box>

        <Autocomplete
          onChange={handleChange}
          sx={{ width: "40%", bgcolor: "white", borderRadius: 2 }}
          freeSolo
          options={data.map((option) => option.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Movies..."
              variant="outlined"
              sx={{ input: { color: "black" }, padding: 1 }}
            />
          )}
        />

        <Box>
          <Tabs
            value={value}
            onChange={(e, val) => setValue(val)}
            textColor="inherit"
            indicatorColor="secondary"
            TabIndicatorProps={{ sx: { height: 3 } }}
          >
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab to="/auth" component={NavLink} label="Auth" />
                <Tab to="/admin" component={NavLink} label="Admin" />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab to="/user" component={NavLink} label="User" />
                <Tab
                  onClick={() => dispatch(userActions.logout())}
                  to="/"
                  component={NavLink}
                  label="Logout"
                />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab to="/profile" component={NavLink} label="Profile" />
                <Tab to="/add" component={NavLink} label="Add Movie" />
                <Tab
                  onClick={() => dispatch(adminActions.logout())}
                  to="/"
                  component={NavLink}
                  label="Logout"
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