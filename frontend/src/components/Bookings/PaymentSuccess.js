import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Dialog, DialogContent, DialogTitle, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyPayment, getMovieById } from '../../api-helpers/api-helpers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (showDialog && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowDialog(false);
      navigate('/user');
    }
    return () => clearInterval(timer);
  }, [showDialog, countdown, navigate]);

  useEffect(() => {
    const verifyAndComplete = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          throw new Error('No session ID found');
        }
        localStorage.setItem('stripeSessionId', sessionId);
      
        const result = await verifyPayment();
        console.log('Payment verification result:', result);
        
        if (result && result.status === 'success') {
          setLoading(false);

          const booking = result.booking;
          // Set initial booking details
          setBookingDetails({
            movieTitle: typeof booking.movie === 'object' ? booking.movie.title : 'Loading...',
            date: new Date(booking.date).toDateString(),
            seatNumbers: Array.isArray(booking.seatNumbers) 
              ? booking.seatNumbers.join(", ")
              : booking.seatNumbers,
            theater: booking.theater,
            timeSlot: booking.timeSlot,
            paymentInfo: booking.paymentInfo
          });

          // If we only have movie ID, fetch the movie details
          if (typeof booking.movie === 'string') {
            try {
              const movieData = await getMovieById(booking.movie);
              if (movieData.movie && movieData.movie.title) {
                setBookingDetails(prev => ({
                  ...prev,
                  movieTitle: movieData.movie.title
                }));
              }
            } catch (err) {
              console.error('Error fetching movie details:', err);
              setBookingDetails(prev => ({
                ...prev,
                movieTitle: 'Movie details unavailable'
              }));
            }
          }

          setShowDialog(true);
          localStorage.removeItem('stripeSessionId');
        } else {
          console.error('Invalid payment verification result:', result);
          throw new Error(result?.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Error completing booking:', err);
        setError(err.message || 'Failed to complete booking');
        setLoading(false);
      }
    };

    verifyAndComplete();
  }, [navigate, location]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="#1c1c1c"
      >
        <CircularProgress sx={{ color: '#FFD700' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>
          Completing your booking...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="#1c1c1c"
      >
        <Typography variant="h6" sx={{ color: '#ff4444' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#1c1c1c"
    >
      <Dialog 
        open={showDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2b2d42',
            color: '#fff',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#FFD700' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Booking Confirmed!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(255, 215, 0, 0.1)', border: '1px solid #FFD700' }}>
            {bookingDetails && (
              <>
                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                  Booking Details:
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <strong>Movie:</strong> {bookingDetails.movieTitle}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <strong>Date:</strong> {bookingDetails.date}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <strong>Show Time:</strong> {bookingDetails.timeSlot.time}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <strong>Location:</strong> {bookingDetails.theater.name}, {bookingDetails.theater.location}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 2 }}>
                  <strong>Seats:</strong> {bookingDetails.seatNumbers}
                </Typography>
                <Typography sx={{ color: '#FFD700', mt: 2, fontStyle: 'italic' }}>
                  Please arrive 15 minutes before show time
                </Typography>
              </>
            )}
          </Paper>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ color: "#FFD700", mb: 2 }}>
              Booking Summary
            </Typography>
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 1,
              alignItems: "center",
              p: 3,
              bgcolor: "#2b2d42",
              borderRadius: 2,
              border: "1px solid #FFD700"
            }}>
              <Typography variant="h6" sx={{ color: "#FFD700" }}>
                {bookingDetails?.movieTitle}
              </Typography>
              <Typography>
                Date: {bookingDetails?.date}
              </Typography>
              <Typography>
                Theater: {bookingDetails?.theater.name} - {bookingDetails?.theater.location}
              </Typography>
              <Typography>
                Time: {bookingDetails?.timeSlot.time}
              </Typography>
              <Typography>
                Seats: {bookingDetails?.seatNumbers}
              </Typography>
              <Typography>
                Total Amount: ₹{bookingDetails?.paymentInfo.amount}
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 2, 
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            Redirecting to your bookings in {countdown} seconds...
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentSuccess; 