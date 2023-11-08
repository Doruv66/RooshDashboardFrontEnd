import React, {useState} from "react";
import './GarageInput.css';
import { useParkingGarage } from "./ParkingGarageContext";
import ParkingGarageApi from '../api/ParkingGarageApi';
import isEqual from 'lodash/isEqual';

export default function GarageInput(){
    const { parkingGarage, setParkingGarage } = useParkingGarage();
    const parkingGarageAttributes = ["name", "airport", "location", "travelTime", "travelDistance", "phoneNumber"];
    const parkingGarageUtilityAttributes = [ "parkingSpaces", "parkingSpacesElectric", "floors"];
    const [editingField, setEditingField] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [isNewGarage, setIsNewGarage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

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

    const handleSaveEditedField = (field) => {
        let updatedParkingGarage = { ...parkingGarage };
        let valueToSave = editingValue;
    
        if (field === "travelTime" || field === "travelDistance" ||
            field === "floors" || field === "parkingSpacesElectric" || 
            field === "parkingSpaces") {
            valueToSave = parseInt(editingValue, 10); 
            console.log(valueToSave)
        }
    
        if (parkingGarageUtilityAttributes.includes(field)) {
            updatedParkingGarage = {
                ...updatedParkingGarage,
                ParkingGarageUtility: {
                    ...updatedParkingGarage.ParkingGarageUtility,
                    [field]: valueToSave
                }
            };
        } 
        else {
            updatedParkingGarage[field] = valueToSave;
        }

        if (!isEqual(updatedParkingGarage, parkingGarage)) {
            switch(field){
                case "name":
                    if(!updatedParkingGarage.name.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "airport":
                    if(!updatedParkingGarage.airport.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "location":
                    if(!updatedParkingGarage.location.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "travelTime":
                    if(updatedParkingGarage.travelTime == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "travelDistance":
                    if(updatedParkingGarage.travelDistance == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "phoneNumber":
                    if(!updatedParkingGarage.phoneNumber.trim()){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "amountOfParkingSpaces":
                    if(updatedParkingGarage.ParkingGarageUtility.amountOfParkingSpaces == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "amountOfElectricParkingSpaces":
                    if(updatedParkingGarage.ParkingGarageUtility.amountOfElectricParkingSpaces == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
                case "floors":
                    if(updatedParkingGarage.ParkingGarageUtility.floors == null){
                        return "Please make sure the field is filled in."
                    }
                    break;
            }
            setParkingGarage(updatedParkingGarage);
        }
        setEditingField(null);
        setEditingValue('');
    };

    const renderEditableField = (field, value) => (
        editingField === field ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            setErrorMessage(handleSaveEditedField(field, value))
          }}>
            <input className="parking-garage-edit"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
            />
            <button className="parking-garage-edit-button" type="submit">Save</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        ) : (
            <div className={`parking-garage-content ${errorMessage ? 'disabled' : ''}`} onClick={() => !errorMessage && handleEditField(field, value)}>
                {value != null ? value : ''}
            </div>
        )
      );

      const handleToggleEParking = () => {
        if (parkingGarage && parkingGarage.ParkingGarageUtility) {
            setParkingGarage(prevState => ({
                ...prevState,
                ParkingGarageUtility: {
                    ...prevState.ParkingGarageUtility,
                    electricChargePoint: !prevState.ParkingGarageUtility.electricChargePoint
                }
            }));
        }
    };
    
    const handleToggleToilets = () => {
        if (parkingGarage && parkingGarage.ParkingGarageUtility) {
            setParkingGarage(prevState => ({
                ...prevState,
                ParkingGarageUtility: {
                    ...prevState.ParkingGarageUtility,
                    toilet: !prevState.ParkingGarageUtility.toilet
                }
            }));        
        }
    };

    const handleCreateNewParkingGarage = () => {
        const newParkingGarage = {
            ...parkingGarageAttributes.reduce((obj, attr) => ({ ...obj, [attr]: null }), {}),
            ParkingGarageUtility: {
                ...parkingGarageUtilityAttributes.reduce((obj, attr) => ({ ...obj, [attr]: null }), {}),
                electricChargePoint: false,
                toilet: false
            }
        };
    
        setParkingGarage(newParkingGarage);        
        setIsNewGarage(true); 
    };

    const handleSaveNewParkingGarage = () => {
        parkingGarage.ParkingGarageUtility.id = 0;
        ParkingGarageApi.createParkingGarage(parkingGarage)
            .then(handleResponse)
            .then(data => {
                console.log('Successfully created new parking garage: ', data);
                setIsNewGarage(false); 
            })
            .catch(error => {
                console.error('Error creating the parking garage:', error);
            });
    };

    const handleDeleteParkingGarage = () => {
        ParkingGarageApi.deleteParkingGarage(parkingGarage.id) 
            .then(handleResponse)
            .then(data => {
                setParkingGarage(null);
                console.log('Successfully deleted parking garage: ', data);
            })
            .catch(error => {
                console.error('Error deleting the parking garage:', error);
            });
    };

    const handleUpdateParkingGarage = () => {
        if (!isEqual(parkingGarage, editingValue)) {
            ParkingGarageApi.updateParkingGarage(parkingGarage.id, editingValue)
                .then(handleResponse)
                .then(data => {
                    console.log('Successfully updated parking garage: ', data);
                })
                .catch(error => {
                    console.error('Error updating the parking garage:', error);
                });
        }
    };

    return (
            <div className="garage-input">
                <div className="form-grid">
                {parkingGarageAttributes.map(attr => (
                    <div className="parking-garage-container" key={attr}>
                    <span className="parking-garage-text">
                        {attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    {renderEditableField(attr, parkingGarage ? parkingGarage[attr] : '')}
                    </div>
                ))}
                {parkingGarageUtilityAttributes.map(attr => (
                    <div className="parking-garage-utilities-container" key={attr}>
                    <span className="parking-garage-text">
                        {attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    {renderEditableField(attr, parkingGarage?.ParkingGarageUtility?.[attr] ?? '')}
                    </div>
                ))}
                <div className="parking-garage-checkboxes-container">
                    <label className="parking-garage-checkbox-label">
                        Electric parking spaces
                        <input type="checkbox" 
                            checked={parkingGarage?.ParkingGarageUtility?.electricChargePoint || false}
                            onChange={handleToggleEParking}
                        />
                    </label>
                    <label className="parking-garage-checkbox-label">
                        Toilets
                        <input type="checkbox" 
                            onChange={handleToggleToilets} 
                            checked={parkingGarage?.ParkingGarageUtility?.toilet || false}
                        />
                    </label>
                </div>
            </div>
            <div className="crud-button-container">
                {!isNewGarage ? (
                    <button className="crud-button" onClick={handleCreateNewParkingGarage}>
                        Create new parking garage
                    </button>
                ) : (
                    <button className="crud-button" onClick={handleSaveNewParkingGarage}>
                        Save new parking garage
                    </button>
                )}
                {!isNewGarage && parkingGarage &&(
                    <>
                        <button className="crud-button" onClick={handleDeleteParkingGarage}>
                            Delete {parkingGarage.name}
                        </button>
                        <button className="crud-button" onClick={handleUpdateParkingGarage}>
                            Update {parkingGarage.name}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
    
}

