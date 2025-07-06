import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MovieBookingsDialog = ({ open, onClose, bookings, movieTitle }) => {
  // Add debug logging
  console.log('Bookings data:', bookings);

  if (!bookings || bookings.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Bookings for {movieTitle}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={3}>
            <Typography variant="subtitle1">No bookings found for this movie</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Bookings for {movieTitle}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Theater</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>PaymentStatus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => {
                // Add debug logging for each booking
                console.log('Booking:', booking);
                console.log('Total Amount:', booking.totalAmount);
                console.log('Payment Info:', booking.paymentInfo);

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">{booking.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{booking.theater.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.theater.location}
                      </Typography>
                    </TableCell>
                    <TableCell>{booking.timeSlot.time}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(booking.seatNumbers) 
                          ? booking.seatNumbers.map(seat => (
                              <Chip 
                                key={seat} 
                                label={seat} 
                                size="small" 
                                sx={{ 
                                  m: 0.5,
                                  backgroundColor: '#FFD700',
                                  color: '#000',
                                  fontWeight: 'bold'
                                }}
                              />
                            ))
                          : booking.seatNumbers}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{booking.totalAmount || booking.paymentInfo?.amount || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.paymentInfo?.status || 'Pending'} 
                        color={booking.paymentInfo?.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default MovieBookingsDialog; 