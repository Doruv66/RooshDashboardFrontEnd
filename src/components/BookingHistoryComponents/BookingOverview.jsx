import React from 'react'
import style from './BookingOverview.module.css'

const BookingOverview = ({ booking }) => {
  return (
    <div className={style.card}>
        <div className={style.booking_details}>
            <p>Name: John Doe</p>
            <p>Service Type: Valet</p>
        </div>
        <div className={style.booking_time}>
            <p>Start Time: 03-11-2023</p>
            <p>End Time: 03-11-2023</p>
        </div>
        <button className={style.btn}>Details</button>
    </div>
  )
}

export default BookingOverview