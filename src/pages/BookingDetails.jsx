import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingApi from '../api/BookingApi'; 
import style from './css/BookingDetails.module.css'
import CustomerInfo from '../components/BookingDetailsComponents/CustomerInfo';
import CarInfo from '../components/BookingDetailsComponents/CarInfo';
import OtherInfo from '../components/BookingDetailsComponents/OtherInfo';
import Flight from '../components/BookingDetailsComponents/Flight';

const BookingDetails = () => {
  // const [booking, setBooking] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  // const { bookingId } = useParams(); 

  // useEffect(() => {
  //   setIsLoading(true);
  //   BookingApi.getBooking(bookingId)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setBooking(data);
  //       setIsLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching booking:', error);
  //       setError(error.message);
  //       setIsLoading(false);
  //     });
  // }, [bookingId]); 

  // if (isLoading) {
  //   return <div>Loading booking details...</div>;
  // }

  // if (error) {
  //   return <div>Error fetching booking: {error}</div>;
  // }

  return (
    <div className={style.booking_details}>
      <h1>Booking details</h1>
      <div className={style.booking_information}>
        <div className={style.customer}>
          <CustomerInfo />
          <CarInfo />
        </div>
        <div className={style.information}>
          <Flight />
          <OtherInfo />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;