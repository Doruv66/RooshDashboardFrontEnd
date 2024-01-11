import React, { useState, useEffect } from 'react';
import style from './css/BookingHistory.module.css'
import BookingHistoryFilters from '../components/BookingHistoryComponents/BookingHistoryFilters'
import BookingList from '../components/BookingHistoryComponents/BookingList'
import BookingAPI from '../api/BookingApi'
import { useParkingGarage } from '../components/ParkingGarageContext';
const BookingHistory = () => {
  const { filters } = useParkingGarage();
  const [bookings, setBookings] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };
  
  useEffect(() => {
    const fetchFilteredBookings = async () => {
        try {
            const data = await BookingAPI.getFilteredBookings(
                filters.garageId,
                filters.service,
                filters.finished,
                filters.ongoing
            );

            console.log('Data received:', data);

            setBookings(data);
        } catch (error) {
            console.error('Error fetching filtered bookings:', error);
        }
    };

    fetchFilteredBookings();
}, [filters]);
  useEffect(() => {
    const sortedBookings = sortBookings(bookings, sortBy);
    setBookings(sortedBookings);
  }, [sortBy]);

  const sortBookings = (bookingsList, sortCriteria) => {
    switch (sortCriteria) {
      case 'startDateAsc':
        return [...bookingsList].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      case 'startDateDesc':
        return [...bookingsList].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      case 'endDateAsc':
        return [...bookingsList].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      case 'endDateDesc':
        return [...bookingsList].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
      default:
        return bookingsList;
    }
  };


  return (
    <div className={style.wrapper}>
      <div className={style.header}>
          <h1>Booking History</h1>
          <BookingHistoryFilters onSortChange={handleSortChange} />
      </div>
      <div className={style.booking_history}>
      <BookingList bookings={bookings} />
      </div>
    </div>
  )
}

export default BookingHistory