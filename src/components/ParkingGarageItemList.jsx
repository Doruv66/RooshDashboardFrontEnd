import { useEffect, useState } from "react";
import ParkingGarageApi from '../api/ParkingGarageApi';
import ParkingGarageItem from './ParkingGarageItem';
import { useParkingGarage } from "./ParkingGarageContext";

export default function ParkingGarageItemList(){
    const [parkingGarages, setParkingGarages] = useState([]);
    const { setParkingGarage } = useParkingGarage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleResponse = response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    };
  
    useEffect(() => {
      ParkingGarageApi.getAllParkingGarages()
      .then(handleResponse)
      .then(data => {
        if(data.parkingGarages){
          setParkingGarages(data.parkingGarages);
          console.log("Succesfully fetched all parking garages", data.parkingGarages);
        }
        else{
          setParkingGarages([]);
        }
      })
      .catch(error => {
        console.error('Error fetching the parking garages:', error);        
        setError('An error occurred while fetching data.');
    })
    .finally(() => {
      setLoading(false);
    });
    }, []);

    const handleInfoClick = (parkingGarageId) => {
        console.log('Info clicked for parking garage ID:', parkingGarageId);
        const garage = parkingGarages.find(p => p.id === parkingGarageId);
        onInfoClick(garage);
        setParkingGarage(garage);
    };


    return  (
        <div>
        {loading ? (
            <div className="parkingGarageItemText">Loading...</div>
        ) : error ? (
            <div className="parkingGarageText">Error: {error}</div>  
        ) : (
            <ul>
                {parkingGarages.length > 0 ? (
                    parkingGarages.map((parkingGarage, parkingGarageId) => (
                        <ParkingGarageItem
                            key={parkingGarageId}
                            plantItem={parkingGarage}
                            onInfo={handleInfoClick}
                        />
                        
                    ))
                ) : (
                    <li className="parkingGarageItem">No results found</li>
                )}
            </ul>
        )}
    </div>
    );
}