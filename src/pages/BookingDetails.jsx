import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingApi from '../api/BookingApi'; 

const BookingDetails = () => {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookingId } = useParams(); 

  useEffect(() => {
    setIsLoading(true);
    BookingApi.getBooking(bookingId)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setBooking(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching booking:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [bookingId]); 

  if (isLoading) {
    return <div>Loading booking details...</div>;
  }

  if (error) {
    return <div>Error fetching booking: {error}</div>;
  }

  return (
    <div>
      {/* Add actually needed details */}
      <div>
        <p>Name: {booking.name}</p>
        <p>Service Type: {booking.service}</p>
      </div>
    </div>
  );
};

export default BookingDetails;