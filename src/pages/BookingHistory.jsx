import React from 'react'
import style from './css/BookingHistory.module.css'
import BookingHistoryFilters from '../components/BookingHistoryComponents/BookingHistoryFilters'
import BookingList from '../components/BookingHistoryComponents/BookingList'

const BookingHistory = () => {
  return (
    <div>
      <div className={style.header}>
          <h1>Booking History</h1>
          <BookingHistoryFilters />
      </div>
      <div className={style.booking_history}>
          <BookingList /> 
      </div>
    </div>
  )
}

export default BookingHistory