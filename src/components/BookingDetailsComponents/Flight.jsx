import React from 'react'
import style from './Flight.module.css'

const Flight = () => {
  return (
    <div className={style.flight}>
        <h2>Flights:</h2>
        <div className={style.flight_numbers}>
            <p>Departure Flight Number: AB 123</p>
            <p>Arrival Flight Number: CD 456</p>
        </div>
    </div>
  )
}

export default Flight