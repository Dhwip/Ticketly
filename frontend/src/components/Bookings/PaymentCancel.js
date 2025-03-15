import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';

const PaymentCancel = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Clean up any pending booking data
    localStorage.removeItem('pendingBooking');
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      textAlign="center"
      sx={{ background: 'linear-gradient(135deg, #1c1c1c, #2b2d42)', color: '#fff', padding: 4 }}
    >
      <CancelIcon sx={{ fontSize: 100, color: '#f44336', marginBottom: 2 }} />
      <Typography variant="h4" gutterBottom sx={{ color: '#FFD700' }}>
        Payment Cancelled
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your booking was not completed.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{
          mt: 3,
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#000',
          fontWeight: 'bold',
          '&:hover': { background: '#FFA500' }
        }}
      >
        Try Again
      </Button>
    </Box>
  );
};

export default PaymentCancel; 