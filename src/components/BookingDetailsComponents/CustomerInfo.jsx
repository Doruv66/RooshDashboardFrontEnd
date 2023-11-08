import React from 'react'
import style from './CustomerInfo.module.css'

const CustomerInfo = ({booking}) => {
    //Change the hardcoded data with actual booking data
  return (
    <div className={style.customer_info}>
        <h2>Customer Info:</h2>
        <p>Name: {booking.customer.name}</p>
        <p>Email: {booking.customer.email}</p>
        <p>Mobile number: {booking.customer.phoneNumber}</p>
    </div>
  )
}

export default CustomerInfo