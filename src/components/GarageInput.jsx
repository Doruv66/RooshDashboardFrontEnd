import React, {useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";

export default function GarageInput(){
    const { parkingGarage, setParkingGarage } = useParkingGarage();
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const parkingGarageUtilityAttributes = [ "amountOfParkingSpaces", "amountOfElectricParkingSpaces", "floors"];
    const [editingField, setEditingField] = useState(null);
    const [editingValue, setEditingValue] = useState('');

    const handleEditField = (field, value) => {
        setEditingField(field);
        setEditingValue(value);
    };

    const handleResponse = response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    };

    const handleSaveEditedField = () => {
        const updatedParkingGarage = { ...parkingGarage, [editingField]: editingValue };
        if (isEqual(updatedParkingGarage, parkingGarage)) {
            console.log("No changes were made.");
            setEditingField(null);
            setEditingValue('');
        } else {
            PlantApi.updatePlant(updatedParkingGarage)
                .then(handleResponse)
                .then(data => {
                    console.log('Successfully updated field: ', data);
                    setMessage("Field updated successfully.");
                    setPlant(updatedParkingGarage);
                    clearMessageAfterTimeout();
                })
                .catch(error => {
                    console.error('Error updating the field:', error);
                    setMessage('Error updating the field.');
                });
            setEditingField(null);
            setEditingValue('');
        }
    };

    const renderEditableField = (field, value) => (
        editingField === field ? 
        (
            <form onSubmit={(e) => {
                e.preventDefault(); 
                handleSaveEditedField();
            }}>
                <input className="parking-garage-edit"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                />
                <button className="parking-garage-edit-button" type="submit">Save</button>
            </form>
        ) : 
        (
            <div className="parking-garage-content" onClick={() => handleEditField(field, value)}>
                {value}
            </div>
        )
    );

    
    return  (
        <form>
            {parkingGarageAttributes.map(attr => (
                <div className="parking-garage-container">
                <span className="parking-garage-text">{attr.replace(/([A-Z])/g, ' $1').replace(/ (\w)/, (match, p1) => ` ${p1.toLowerCase()}`)} </span>
                {renderEditableField(attr, parkingGarage[attr])}
                </div>
            ))}
            {parkingGarageUtilityAttributes.map(attr => (
                <div className="parking-garage-utilities-container">
                <span className="parking-garage-text">{attr.replace(/([A-Z])/g, ' $1').replace(/ (\w)/, (match, p1) => ` ${p1.toLowerCase()}`)} </span>
                {renderEditableField(attr, parkingGarage.ParkingGarageUtility[attr])}
                </div>
            ))}
            <input type="checkbox"></input>
            <input type="checkbox"></input>
        </form>
    );
}

