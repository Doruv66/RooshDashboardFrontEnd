import React from 'react'
import style from './OtherInfo.module.css'

const OtherInfo = ({booking}) => {
    //change with actual booking information
  return (
    <div className={style.other_info}>
        <h3>Other:</h3>
        <div className={style.information}>
            <div>
                <p>Departure Date: {booking.startDate}</p>
                <p>Arrival Date: {booking.endDate}</p>
            </div>
            <div>
                <p>Service Type: {booking.service.serviceType}</p>
                {/* <p>Assigned Space: 302</p> */}
            </div>
        </div>
    </div>
  )
}

export default OtherInfo