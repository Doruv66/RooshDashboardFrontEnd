import React from 'react'
import style from './OtherInfo.module.css'

const OtherInfo = ({booking}) => {
    //change with actual booking information
  return (
    <div className={style.other_info}>
        <h3>Other:</h3>
        <div className={style.information}>
            <div>
                <p>Departur Date: 20-03-2024</p>
                <p>Arrival Date: 20-03-2024</p>
            </div>
            <div>
                <p>Service Type: Shuttle</p>
                <p>Assigned Space: 302</p>
            </div>
        </div>
    </div>
  )
}

export default OtherInfo