import React from 'react'
import style from './CarInfo.module.css'

const CarInfo = ({booking}) => {
    //change with actual booking info
  return (
    <div className={style.car_info}>
        <h2>Car Info:</h2>
        <p>License Plate: 123-sf-123</p>
        <p>Brand: Mercedes</p>
        <p>Model: s class</p>
        <p>Electric: no</p>
    </div>
  )
}

export default CarInfo