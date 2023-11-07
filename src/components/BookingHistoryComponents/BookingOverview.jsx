import React from 'react'
import style from './BookingOverview.module.css'

const BookingOverview = ({ booking }) => {

  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/booking/${booking.id}`); 
  };
  return (
    <div className={style.card}>
        <div className={style.booking_details}>
            <p>Name: {booking.name}</p> 
            <p>Service Type: {booking.service}</p> 
        </div>
        <div className={style.booking_time}>
            <p>Start Time: {booking.startDate}</p> 
            <p>End Time: {booking.endDate}</p> 
        </div>
        <button className={style.btn} onClick={handleDetailsClick}>Details</button>
    </div>
  )
}

export default BookingOverview;