import React from 'react'
import style from './BookingList.module.css'
import BookingOverview from './BookingOverview'

const BookingList = () => {
  return (
    <div className={style.booking_list}>
        <BookingOverview />
        <BookingOverview />
        <BookingOverview />
        <BookingOverview />
        <BookingOverview />
    </div>
  )
}

export default BookingList