import React from 'react'
import style from './BookingHistoryFilters.module.css'

const BookingHistoryFilters = () => {
  return (
    <div className={style.filters}>
        <div>
            <h3>Sort By:</h3>
            <p>Drop Down Menu with Options</p>
        </div>
        <div>
            <p>Complete Bookings checkbox</p>
            <p>Ongoing Bookings checkbox</p>
        </div>
        <div>
            <p>Show valet checkbox</p>
            <p>Show Shuttle checkbox</p>
        </div>
    </div>
  )
}

export default BookingHistoryFilters