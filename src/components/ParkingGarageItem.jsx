import React from "react";
import './ParkingGarageItem.css';

export default function ParkingGarageItem({parkingGarageItem, onInfo}){

    const handleItemClick = () => {
        onInfo(parkingGarageItem.id);
      };


    return  (
        <li className="parkingGarageItem" onClick={handleItemClick}>
            <span className="parkingGarageItemText">Garage:</span>
            <div className="parkingGarageItemContent">{parkingGarageItem.name}</div>
        </li>
    );
}
