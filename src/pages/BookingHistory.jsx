import React from 'react'
import style from './css/BookingHistory.module.css'
import BookingHistoryFilters from '../components/BookingHistoryComponents/BookingHistoryFilters'
import BookingList from '../components/BookingHistoryComponents/BookingList'
import BookingApi from '../api/BookingApi'
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    BookingApi.getAllBookings()
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);


  return (
    <div className={style.wrapper}>
      <div className={style.header}>
          <h1>Booking History</h1>
          <BookingHistoryFilters />
      </div>
      <div className={style.booking_history}>
      <BookingList bookings={bookings} />
      </div>
    </div>
  )
}

export default BookingHistory