import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingApi from '../api/BookingApi';
import style from './css/BookingDetails.module.css';

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
        {booking.customer && (
          <div>
            <h2>Customer Information</h2>
            <p>Name: {booking.customer.name}</p>
            <p>Email: {booking.customer.email}</p>
            <p>Phone Number: {booking.customer.phoneNumber}</p>
          </div>
        )}
        {booking.car && (
          <div>
            <h2>Car Information</h2>
            <p>License Plate: {booking.car.licensePlate}</p>
            <p>Brand: {booking.car.brand}</p>
            <p>Model: {booking.car.model}</p>
            <p>Electric: {booking.car.electric ? 'Yes' : 'No'}</p>
          </div>
        )}
        {booking.flightNumberDeparture && booking.flightNumberArrival && (
          <div>
            <h2>Flight Information</h2>
            <p>Departure Flight Number: {booking.flightNumberDeparture}</p>
            <p>Arrival Flight Number: {booking.flightNumberArrival}</p>
          </div>
        )}
        {booking.garage && (
          <div>
            <h2>Other Information</h2>
            <p>Garage: {booking.garage.name}</p>
            <p>Location: {booking.garage.location}</p>
            <p>Travel Time to Airport: {booking.garage.travelTime} minutes</p>
            <p>Travel Distance: {booking.garage.travelDistance} km</p>
          </div>
        )}
        {booking.service && (
          <div>
            <h2>Service Type</h2>
            <p>{booking.service.serviceType}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;