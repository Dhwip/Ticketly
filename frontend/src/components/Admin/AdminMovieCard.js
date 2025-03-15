import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBookingsByMovieId } from '../../api-helpers/api-helpers';
import MovieBookingsDialog from './MovieBookingsDialog';

const AdminMovieCard = ({ title, description, posterUrl, id, onDelete, language }) => {
  const [openBookings, setOpenBookings] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleCardClick = async () => {
    try {
      const response = await getBookingsByMovieId(id);
      setBookings(response.bookings || []);
      setOpenBookings(true);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      setOpenBookings(true);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await onDelete();
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          width: 250, 
          height: 320, 
          margin: 2, 
          borderRadius: 5, 
          ":hover": {
            boxShadow: "10px 10px 20px #ccc",
            cursor: 'pointer'
          },
          position: 'relative'
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}>
          <IconButton 
            onClick={handleDelete}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { 
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                color: 'red'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <CardMedia
          sx={{ height: 200 }}
          image={posterUrl}
          title={title}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography gutterBottom variant="h6" component="div" sx={{ 
              fontSize: "1.1rem",
              fontWeight: "bold",
              maxWidth: "70%"
            }}>
              {title}
            </Typography>
            {language && (
              <Chip
                label={language}
                size="small"
                sx={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {description}
          </Typography>
        </CardContent>
      </Card>

      <MovieBookingsDialog
        open={openBookings}
        onClose={() => setOpenBookings(false)}
        bookings={bookings}
        movieTitle={title}
      />
    </>
  );
};

export default AdminMovieCard; 