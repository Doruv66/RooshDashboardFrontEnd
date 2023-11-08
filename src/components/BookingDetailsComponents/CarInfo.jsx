import React from 'react'
import style from './CarInfo.module.css'

const CarInfo = ({booking}) => {
    //change with actual booking info
  return (
    <div className={style.car_info}>
        <h2>Car Info:</h2>
        <p>License Plate: {booking.car.licensePlate}</p>
        <p>Brand: {booking.car.brand}</p>
        <p>Model: {booking.car.model}</p>
        <p>Electric: {booking.car.electric ? 'Yes' : 'No'}</p>
    </div>
  )
}

export default CarInfo