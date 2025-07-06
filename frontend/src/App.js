import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import Admin from "./components/Auth/Admin";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Bookings/Booking";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage";
import AddMovie from "./components/Movies/AddMovie";
import Movies from "./components/Movies/Movies";
import AdminProfile from "./profile/AdminProfile";
import UserProfile from "./profile/UserProfile";
import { adminActions, userActions } from "./store";
import { ToastContainer } from "react-toastify";
import PaymentSuccess from "./components/Bookings/PaymentSuccess";
import PaymentCancel from "./components/Bookings/PaymentCancel";
import ResetPassword from "./components/Auth/ResetPassword";

// Protected Route Component
const ProtectedRoute = ({ children, isLoggedIn, redirectTo = "/" }) => {
  return isLoggedIn ? <Navigate to={redirectTo} replace /> : children;
};

// Auth Required Route Component
const AuthRequiredRoute = ({ children, isLoggedIn, redirectTo = "/auth" }) => {
  return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  console.log("isAdminLoggedIn", isAdminLoggedIn);
  console.log("isUserLoggedIn", isUserLoggedIn);
  
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispatch(userActions.login());
    } else if (localStorage.getItem("adminId")) {
      dispatch(adminActions.login());
    }
  }, [dispatch]);

  // Handle navigation to prevent going back to auth pages after login
  useEffect(() => {
    const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
    const isAuthPage = location.pathname === "/auth" || location.pathname === "/admin";
    
    if (isLoggedIn && isAuthPage) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, isUserLoggedIn, isAdminLoggedIn, navigate]);

  // Prevent browser back button from going to auth pages after login
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
      if (isLoggedIn) {
        // Clear any auth-related history entries
        window.history.replaceState(null, null, "/");
      }
    };

    const handlePopState = (event) => {
      const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
      const isAuthPage = location.pathname === "/auth" || location.pathname === "/admin";
      
      if (isLoggedIn && isAuthPage) {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isUserLoggedIn, isAdminLoggedIn, location.pathname, navigate]);
  
  return (
    <div>
      <ToastContainer />
      <Header />
      <section>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/booking/success" element={<PaymentSuccess />} />
          <Route path="/booking/cancel" element={<PaymentCancel />} />
          
          {/* Auth routes - redirect to home if already logged in */}
          <Route 
            path="/auth" 
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn || isAdminLoggedIn}>
                <Auth />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn || isAdminLoggedIn}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          {/* User routes - require user login */}
          <Route 
            path="/user" 
            element={
              <AuthRequiredRoute isLoggedIn={isUserLoggedIn && !isAdminLoggedIn}>
                <UserProfile />
              </AuthRequiredRoute>
            } 
          />
          <Route 
            path="/booking/:id" 
            element={
              <AuthRequiredRoute isLoggedIn={isUserLoggedIn && !isAdminLoggedIn}>
                <Booking />
              </AuthRequiredRoute>
            } 
          />
          
          {/* Admin routes - require admin login */}
          <Route 
            path="/add" 
            element={
              <AuthRequiredRoute isLoggedIn={isAdminLoggedIn && !isUserLoggedIn}>
                <AddMovie />
              </AuthRequiredRoute>
            } 
          />
          <Route 
            path="/user-admin" 
            element={
              <AuthRequiredRoute isLoggedIn={isAdminLoggedIn && !isUserLoggedIn}>
                <AdminProfile />
              </AuthRequiredRoute>
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
