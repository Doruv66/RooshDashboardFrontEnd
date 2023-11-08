import React from 'react'
import style from './Flight.module.css'

const Flight = ({booking}) => {
  return (
    <div className={style.flight}>
        <h2>Flights:</h2>
        <div className={style.flight_numbers}>
            <p>Departure Flight Number: {booking.flightNumberDeparture}</p>
            <p>Arrival Flight Number: {booking.flightNumberArrival}</p>
        </div>
    </div>
  )
}

export default Flight