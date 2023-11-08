import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingApi from '../api/BookingApi';
import style from './css/BookingDetails.module.css';
import CustomerInfo from '../components/BookingDetailsComponents/CustomerInfo';
import CarInfo from '../components/BookingDetailsComponents/CarInfo';
import OtherInfo from '../components/BookingDetailsComponents/OtherInfo';
import Flight from '../components/BookingDetailsComponents/Flight';

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
        setBooking(data.booking);
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

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div className={style.booking_details}>
      <h1>Booking details</h1>
      <div className={style.booking_information}>
        <div className={style.customer}>
          
          <CustomerInfo booking={booking} />
          {/* Pass the entire booking object to the CarInfo component */}
          <CarInfo booking={booking} />
        </div>
        <div className={style.information}>
          {/* Pass the entire booking object to the Flight component */}
          <Flight booking={booking} />
          {/* Pass the entire booking object to the OtherInfo component */}
          <OtherInfo booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;