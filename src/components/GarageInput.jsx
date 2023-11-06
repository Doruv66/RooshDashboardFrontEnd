import React from "react";
import './GarageInput.css';


export default function GarageInput(){

    return  (

        <form>
            <label for="Name">Name:</label>
            <div className="text-input">
                <input type="text" id="Name" name="Name"></input>
                    <select id="Airport" name="Airport">
                        <option value="" disabled selected>Select your Airport</option>
                        <option value="city1">Airport 1</option>
                        <option value="city2">Airport 2</option>
                        <option value="city3">Airport 3</option>
                    </select>
                <label for="Location">Location:</label>
                <input type="text" id="Location" name="Location"></input>
                <label for="TravelTime">Travel time to the airport in minutes:</label>
                <input type="text" id="TravelTime" name="TravelTime"></input>
                <label for="TravelDistance">Distance to the airport in meters:</label>
                <input type="text" id="TravelDistance" name="TravelDistance"></input>
                <label for="Telephone">Telephone number:</label>
                <input type="text" id="Telephone" name="Telephone"></input>
            </div>
            <h5>Garage Services</h5>
            <div className="checkbox-container">
                <input type="checkbox" id="toilets" name="toilets" value="toilets"></input>
                <label for="toilets"> toilets</label><br></br>
                <input type="checkbox" id="Electric" name="Electric" value="Electric"></input>
                <label for="toilets"> Electric Charging</label><br></br>
                <input type="checkbox" id="Valet" name="Valet" value="Valet"></input>
                <label for="toilets"> Valet Service</label><br></br>
                <input type="checkbox" id="Shuttle" name="Shuttle" value="Shuttle"></input>
                <label for="toilets"> Shuttle Service</label><br></br>
            </div>
                <label for="Floors">Floors:</label>
                <input type="Floors" id="Floors" name="Floors"></input>
                <label for="nonElecParking">Non-Electric parking spaces:</label>
                <input type="text" id="nonElecParking" name="nonElecParking"></input>

                <label for="ElecParking">Electric parking spaces:</label>
                <input type="text" id="ElecParking" name="ElecParking"></input>
        </form>
        

    );
}

