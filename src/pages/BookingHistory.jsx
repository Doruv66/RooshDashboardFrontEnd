import React, { useState, useEffect } from 'react';
import style from './css/BookingHistory.module.css'
import BookingHistoryFilters from '../components/BookingHistoryComponents/BookingHistoryFilters'
import BookingList from '../components/BookingHistoryComponents/BookingList'
import BookingApi from '../api/BookingApi'
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
        // Constructing the URL for fetching
        const fetchUrl = `http://localhost:8080/bookings/filter?garageId=${filters.garageId}&service=${filters.service}&finished=${filters.finished}&ongoing=${filters.ongoing}`;
        console.log("Fetching from URL:", fetchUrl);

        try {
            // Fetching filtered bookings
            const response = await fetch(fetchUrl);

            // Check for a valid response
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parsing the response as JSON
            const data = await response.json();
            console.log('Data received:', data); // Debugging: Log the received data

            // Updating state with the fetched bookings
            setBookings(data);
        } catch (error) {
            // Handling errors
            console.error('Error fetching filtered bookings:', error);
        }
    };

    // Call the fetch function if the necessary filter (garageId) is set
    if (filters.garageId) {
        fetchFilteredBookings();
    }
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