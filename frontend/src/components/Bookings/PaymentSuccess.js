import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyPayment } from '../../api-helpers/api-helpers';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAndComplete = async () => {
      try {
        // Get session ID from URL params
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        // Store session ID for verification
        localStorage.setItem('stripeSessionId', sessionId);
        
        // Verify payment and create booking
        const result = await verifyPayment();
        
        if (result) {
          setLoading(false);
          // Redirect to user profile after 2 seconds
          setTimeout(() => {
            navigate('/user');
          }, 2000);
        } else {
          throw new Error('Payment verification failed');
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
      <Typography variant="h4" sx={{ color: '#FFD700', mb: 2 }}>
        Payment Successful!
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff' }}>
        Redirecting to your bookings...
      </Typography>
    </Box>
  );
};

export default PaymentSuccess; 