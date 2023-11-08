import React from 'react'
import style from './CustomerInfo.module.css'

const CustomerInfo = ({booking}) => {
    //Change the hardcoded data with actual booking data
  return (
    <div className={style.customer_info}>
        <h2>Customer Info:</h2>
        <p>Name: Arthur Jasper</p>
        <p>Email: arthur@gmail.com</p>
        <p>Mobile number: +312 213123 123123</p>
    </div>
  )
}

export default CustomerInfo