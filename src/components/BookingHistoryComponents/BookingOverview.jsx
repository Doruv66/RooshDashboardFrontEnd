import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingOverview = ({ booking }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/booking/${booking.id}`);
  };

  const formatDateTime = (dateTime) => {
    const formattedDate = new Date(dateTime).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };

  return (
    <Card
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <CardContent>
        <div>
          <Typography variant="body1">Name: {booking.customer.name}</Typography>
          <Typography variant="body1">Service Type: {booking.service.serviceType}</Typography>
        </div>
      </CardContent>
      <CardContent>
        <div>
          <Typography variant="body1">Start Time: {formatDateTime(booking.startDate)}</Typography>
          <Typography variant="body1">End Time: {formatDateTime(booking.endDate)}</Typography>
        </div>
      </CardContent>
      <CardContent sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleDetailsClick}
          sx={{ width: '100%', textTransform: 'none', bgcolor: "#DA4A0C", '&:hover': {
            bgcolor: '#e80',
          }}}
        >
          Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingOverview;
