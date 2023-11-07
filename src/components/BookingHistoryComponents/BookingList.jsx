import React from 'react';
import style from './BookingList.module.css';
import BookingOverview from './BookingOverview';

const BookingList = ({ bookings }) => { 
  return (
    <div className={style.booking_list}>
      {bookings.map(booking => (
        <BookingOverview key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default BookingList;