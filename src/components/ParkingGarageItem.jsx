import React from "react";

export default function ParkingGarageitem({parkingGarageitem, onInfo}){

    const handleItemClick = () => {
        onInfo(parkingGarageitem.id);
      };


    return  (
        <li className="parkingGarageItem" onClick={handleItemClick}>
            <span className="parkingGarageItemText">Garage:</span>
            <div className="parkingGarageItemContent">{plantItem.Address}</div>
        </li>
    );
}
