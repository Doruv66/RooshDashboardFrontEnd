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
    const make=[];

    
    return (
        <div className="garage-input">
            <div className="form-grid">
                {parkingGarageAttributes.map(attr => (
                    <div className="parking-garage-container" key={attr}>
                        <span className="parking-garage-text">{attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </span>
                        {renderEditableField(attr, parkingGarage[attr])}
                    </div>
                ))}
                {parkingGarageUtilityAttributes.map(attr => (
                    <div className="parking-garage-utilities-container" key={attr}>
                        <span className="parking-garage-text">{attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </span>
                        {renderEditableField(attr, parkingGarage.ParkingGarageUtility[attr])}
                    </div>
                ))}
                <div className="parking-garage-checkboxes-container">
                    <label className="parking-garage-checkbox-label">
                        Electric parking spaces
                        <input type="checkbox" name="electricParkingSpaces" />
                        <span className="parking-garage-checkbox"></span>
                    </label>
                    <label className="parking-garage-checkbox-label">
                        Toilets
                        <input type="checkbox" name="toilets" />
                        <span className="parking-garage-checkbox"></span>
                    </label>
                </div>
            </div>
            <div className="crud-button-container">
                <button className="crud-button" onClick={make}>Create new parking garage</button>
                <button className="crud-button" onClick={make}>Delete {parkingGarage.name}</button>
                <button className="crud-button" onClick={make}>Update {parkingGarage.name}</button>
            </div>
        </div>
    );
    
}

