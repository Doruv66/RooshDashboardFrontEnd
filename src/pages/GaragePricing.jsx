import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import ParkingGarageApi from '../api/ParkingGarageApi';

import PriceListApi from '../api/PriceList';
import TokenManager from "../api/TokenManager.jsx";  // Import the PriceListApi
import { useParkingGarage } from '../components/ParkingGarageContext.jsx';
import Alert from '@mui/material/Alert';

function GaragePricing() {
  const { parkingGarage, setParkingGarage } = useParkingGarage();
  const [shuttleUncoveredChecked, setShuttleUncoveredChecked] = useState(true);
  const [shuttleCoveredChecked, setShuttleCoveredChecked] = useState(true);
  const [valetUncoveredChecked, setValetUncoveredChecked] = useState(true);
  const [failedMessage, setFailedMessage] = useState(null);

  const [shuttleUncoveredValues, setShuttleUncoveredValues] = useState(Array.from({ length: 30 }, () => ''));
  const [shuttleCoveredValues, setShuttleCoveredValues] = useState(Array.from({ length: 30 }, () => ''));
  const [valetUncoveredValues, setValetUncoveredValues] = useState(Array.from({ length: 30 }, () => ''));

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [parkingGarages, setParkingGarages] = useState([]);

  const [existingPriceLists, setExistingPriceLists] = useState([]);

  // const[shuttleUncovered, setShuttleUncovered] = useState(null);
  // const[shuttleCovered, setShuttleCovered] = useState(null);
  // const[valetUncovered, setvaletUncovered] = useState(null);

  

  const handleResponse = response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  const getParkingGarage = () => {
    const userId = TokenManager.getClaims().id;
    ParkingGarageApi.getParkingGaragesByUserId(userId)
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
  }

  useEffect(() => {
    // Set all items as included when the component mounts
    setShuttleUncoveredChecked(true);
    setShuttleCoveredChecked(true);
    setValetUncoveredChecked(true);

    // Fetch existing price lists when the component mounts
    fetchExistingPriceLists();
   
   
  }, []);


  const handleCheckboxChange = (prefix, value) => {
    switch (prefix) {
      case 'shuttleUncovered':
        setShuttleUncoveredChecked(value);
        if (!value) setShuttleUncoveredValues(Array.from({ length: 30 }, () => ''));
        break;
      case 'shuttleCovered':
        setShuttleCoveredChecked(value);
        if (!value) setShuttleCoveredValues(Array.from({ length: 30 }, () => ''));
        break;
      case 'valetUncovered':
        setValetUncoveredChecked(value);
        if (!value) setValetUncoveredValues(Array.from({ length: 30 }, () => ''));
        break;
      default:
        break;
    }
  };

  const handleInputChange = (values, setValues) => (index) => (event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
  };

  const renderInputBoxes = (prefix, values, editable, setValues) => {
    const days = Array.from({ length: 30 }, (_, index) => index + 1);

    return days.map((day, index) => (
      <TextField
        key={day}
        label={`Day ${day}`}
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={values[index]}
        onChange={handleInputChange(values, setValues)(index)}
        InputProps={{ inputProps: { min: 0 }, readOnly: !editable }}
        sx={{ backgroundColor: !editable ? '#f2f2f2' : 'inherit' }}
      />
    )).concat(
      <TextField
        key={`${prefix}After30Days`}
        label={`After 30 Days`}
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={values[30]}
        onChange={handleInputChange(values, setValues)(30)}
        InputProps={{ inputProps: { min: 0 }, readOnly: !editable }}
        sx={{ backgroundColor: !editable ? '#f2f2f2' : 'inherit' }}
      />
    );
  };

  const handleSaveButtonClick = async () => {
    
    if(shuttleUncoveredValues[1] != "") {
      try {

        const existingPriceListResponse = await PriceListApi.getPriceListByParkingGarage(parkingGarage.id);
        const existingPriceLists = await existingPriceListResponse.json();

        console.log(existingPriceLists);

         // Ensure existingPriceLists is an array
          const existingPriceListsArray = Array.isArray(existingPriceLists.priceLists) ? existingPriceLists.priceLists : [existingPriceLists.priceLists];

          // Check for date range overlaps
          const isOverlap = existingPriceListsArray.some(priceList => {
            const priceListStartDate = new Date(priceList.startDate);
            const priceListEndDate = new Date(priceList.endDate);

            const newStartDate = startDate;
            const newEndDate = endDate;

            return (
              (newStartDate >= priceListStartDate && newStartDate <= priceListEndDate) ||
              (newEndDate >= priceListStartDate && newEndDate <= priceListEndDate) ||
              (newStartDate <= priceListStartDate && newEndDate >= priceListEndDate)
            );
          });

          if (isOverlap) {
            console.error('Date range overlaps with existing price scheme. Cannot save.');
            setFailedMessage("Date range overlaps with existing price scheme. Cannot save.");
            setTimeout(() => {
              setFailedMessage(null);
            }, 3000);

            return;
          }

        // Prepare the payload based on the backend entity structure
        const payload = {
          id: 0,
          garage: parkingGarage, // Replace with the actual garage ID
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          day1Price: parseFloat(shuttleUncoveredValues[0]),
          day2Price: parseFloat(shuttleUncoveredValues[1]),
          day3Price: parseFloat(shuttleUncoveredValues[2]),
          day4Price: parseFloat(shuttleUncoveredValues[3]),
          day5Price: parseFloat(shuttleUncoveredValues[4]),
          day6Price: parseFloat(shuttleUncoveredValues[5]),
          day7Price: parseFloat(shuttleUncoveredValues[6]),
          day8Price: parseFloat(shuttleUncoveredValues[7]),
          day9Price: parseFloat(shuttleUncoveredValues[8]),
          day10Price: parseFloat(shuttleUncoveredValues[9]),
          day11Price: parseFloat(shuttleUncoveredValues[10]),
          day12Price: parseFloat(shuttleUncoveredValues[11]),
          day13Price: parseFloat(shuttleUncoveredValues[12]),
          day14Price: parseFloat(shuttleUncoveredValues[13]),
          day15Price: parseFloat(shuttleUncoveredValues[14]),
          day16Price: parseFloat(shuttleUncoveredValues[15]),
          day17Price: parseFloat(shuttleUncoveredValues[16]),
          day18Price: parseFloat(shuttleUncoveredValues[17]),
          day19Price: parseFloat(shuttleUncoveredValues[18]),
          day20Price: parseFloat(shuttleUncoveredValues[19]),
          day21Price: parseFloat(shuttleUncoveredValues[20]),
          day22Price: parseFloat(shuttleUncoveredValues[21]),
          day23Price: parseFloat(shuttleUncoveredValues[22]),
          day24Price: parseFloat(shuttleUncoveredValues[23]),
          day25Price: parseFloat(shuttleUncoveredValues[24]),
          day26Price: parseFloat(shuttleUncoveredValues[25]),
          day27Price: parseFloat(shuttleUncoveredValues[26]),
          day28Price: parseFloat(shuttleUncoveredValues[27]),
          day29Price: parseFloat(shuttleUncoveredValues[28]),
          day30Price: parseFloat(shuttleUncoveredValues[29]),
          extraDayPrice: parseFloat(shuttleUncoveredValues[30]),
          type: "Shuttle uncovered"
        };
  
        const updatedGarage = {
          ...payload,
          garage: {
            ...payload.garage,
            account: {
              ...payload.garage.account,
              roles: [], // Set roles to an empty array
            },
          },
        };
  
        // Call the createPriceList method from PriceListApi with the adjusted payload
        console.log(updatedGarage)
        await PriceListApi.createPriceList(updatedGarage);
  
        console.log('Price list saved!');
        
        
        // Refetch existing price lists after saving
        fetchExistingPriceLists();
      } catch (error) {
        console.error('Error saving price list:', error);
        
        // Add logic to handle error (e.g., show an error message)
      }
    }
    if(shuttleCoveredValues[1] != "") {
      try {

        const existingPriceListResponse = await PriceListApi.getPriceListByParkingGarage(parkingGarage.id);
        const existingPriceLists = await existingPriceListResponse.json();

        console.log(existingPriceLists);

         // Ensure existingPriceLists is an array
          const existingPriceListsArray = Array.isArray(existingPriceLists.priceLists) ? existingPriceLists.priceLists : [existingPriceLists.priceLists];

          // Check for date range overlaps
          const isOverlap = existingPriceListsArray.some(priceList => {
            const priceListStartDate = new Date(priceList.startDate);
            const priceListEndDate = new Date(priceList.endDate);

            const newStartDate = startDate;
            const newEndDate = endDate;

            return (
              (newStartDate >= priceListStartDate && newStartDate <= priceListEndDate) ||
              (newEndDate >= priceListStartDate && newEndDate <= priceListEndDate) ||
              (newStartDate <= priceListStartDate && newEndDate >= priceListEndDate)
            );
          });

          if (isOverlap) {
            console.error('Date range overlaps with existing price scheme. Cannot save.');
            setFailedMessage("Date range overlaps with existing price scheme. Cannot save.");
            setTimeout(() => {
              setFailedMessage(null);
            }, 3000);

            return;
          }
        // Prepare the payload based on the backend entity structure
        const payload = {
          id: 0,
          garage: parkingGarage, // Replace with the actual garage ID
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          day1Price: parseFloat(shuttleUncoveredValues[0]),
          day2Price: parseFloat(shuttleUncoveredValues[1]),
          day3Price: parseFloat(shuttleUncoveredValues[2]),
          day4Price: parseFloat(shuttleUncoveredValues[3]),
          day5Price: parseFloat(shuttleUncoveredValues[4]),
          day6Price: parseFloat(shuttleUncoveredValues[5]),
          day7Price: parseFloat(shuttleUncoveredValues[6]),
          day8Price: parseFloat(shuttleUncoveredValues[7]),
          day9Price: parseFloat(shuttleUncoveredValues[8]),
          day10Price: parseFloat(shuttleUncoveredValues[9]),
          day11Price: parseFloat(shuttleUncoveredValues[10]),
          day12Price: parseFloat(shuttleUncoveredValues[11]),
          day13Price: parseFloat(shuttleUncoveredValues[12]),
          day14Price: parseFloat(shuttleUncoveredValues[13]),
          day15Price: parseFloat(shuttleUncoveredValues[14]),
          day16Price: parseFloat(shuttleUncoveredValues[15]),
          day17Price: parseFloat(shuttleUncoveredValues[16]),
          day18Price: parseFloat(shuttleUncoveredValues[17]),
          day19Price: parseFloat(shuttleUncoveredValues[18]),
          day20Price: parseFloat(shuttleUncoveredValues[19]),
          day21Price: parseFloat(shuttleUncoveredValues[20]),
          day22Price: parseFloat(shuttleUncoveredValues[21]),
          day23Price: parseFloat(shuttleUncoveredValues[22]),
          day24Price: parseFloat(shuttleUncoveredValues[23]),
          day25Price: parseFloat(shuttleUncoveredValues[24]),
          day26Price: parseFloat(shuttleUncoveredValues[25]),
          day27Price: parseFloat(shuttleUncoveredValues[26]),
          day28Price: parseFloat(shuttleUncoveredValues[27]),
          day29Price: parseFloat(shuttleUncoveredValues[28]),
          day30Price: parseFloat(shuttleUncoveredValues[29]),
          extraDayPrice: parseFloat(shuttleUncoveredValues[30]),
          type: "Shuttle covered"
        };
  
        const updatedGarage = {
          ...payload,
          garage: {
            ...payload.garage,
            account: {
              ...payload.garage.account,
              roles: [], // Set roles to an empty array
            },
          },
        };
  
        // Call the createPriceList method from PriceListApi with the adjusted payload
        console.log(updatedGarage)
        await PriceListApi.createPriceList(updatedGarage);
  
        console.log('Price list saved!');
        
        // Refetch existing price lists after saving
        fetchExistingPriceLists();
      } catch (error) {
        console.error('Error saving price list:', error);
        // Add logic to handle error (e.g., show an error message)
      } 
    }
    if(valetUncoveredValues[1] != "") {
      try {

        const existingPriceListResponse = await PriceListApi.getPriceListByParkingGarage(parkingGarage.id);
        const existingPriceLists = await existingPriceListResponse.json();

        console.log(existingPriceLists);

         // Ensure existingPriceLists is an array
          const existingPriceListsArray = Array.isArray(existingPriceLists.priceLists) ? existingPriceLists.priceLists : [existingPriceLists.priceLists];

          // Check for date range overlaps
          const isOverlap = existingPriceListsArray.some(priceList => {
            const priceListStartDate = new Date(priceList.startDate);
            const priceListEndDate = new Date(priceList.endDate);

            const newStartDate = startDate;
            const newEndDate = endDate;

            return (
              (newStartDate >= priceListStartDate && newStartDate <= priceListEndDate) ||
              (newEndDate >= priceListStartDate && newEndDate <= priceListEndDate) ||
              (newStartDate <= priceListStartDate && newEndDate >= priceListEndDate)
            );
          });

          if (isOverlap) {
            console.error('Date range overlaps with existing price scheme. Cannot save.');
            setFailedMessage("Date range overlaps with existing price scheme. Cannot save.");
            setTimeout(() => {
              setFailedMessage(null);
            }, 3000);

            return;
          }
        // Prepare the payload based on the backend entity structure
        const payload = {
          id: 0,
          garage: parkingGarage, // Replace with the actual garage ID
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          day1Price: parseFloat(shuttleUncoveredValues[0]),
          day2Price: parseFloat(shuttleUncoveredValues[1]),
          day3Price: parseFloat(shuttleUncoveredValues[2]),
          day4Price: parseFloat(shuttleUncoveredValues[3]),
          day5Price: parseFloat(shuttleUncoveredValues[4]),
          day6Price: parseFloat(shuttleUncoveredValues[5]),
          day7Price: parseFloat(shuttleUncoveredValues[6]),
          day8Price: parseFloat(shuttleUncoveredValues[7]),
          day9Price: parseFloat(shuttleUncoveredValues[8]),
          day10Price: parseFloat(shuttleUncoveredValues[9]),
          day11Price: parseFloat(shuttleUncoveredValues[10]),
          day12Price: parseFloat(shuttleUncoveredValues[11]),
          day13Price: parseFloat(shuttleUncoveredValues[12]),
          day14Price: parseFloat(shuttleUncoveredValues[13]),
          day15Price: parseFloat(shuttleUncoveredValues[14]),
          day16Price: parseFloat(shuttleUncoveredValues[15]),
          day17Price: parseFloat(shuttleUncoveredValues[16]),
          day18Price: parseFloat(shuttleUncoveredValues[17]),
          day19Price: parseFloat(shuttleUncoveredValues[18]),
          day20Price: parseFloat(shuttleUncoveredValues[19]),
          day21Price: parseFloat(shuttleUncoveredValues[20]),
          day22Price: parseFloat(shuttleUncoveredValues[21]),
          day23Price: parseFloat(shuttleUncoveredValues[22]),
          day24Price: parseFloat(shuttleUncoveredValues[23]),
          day25Price: parseFloat(shuttleUncoveredValues[24]),
          day26Price: parseFloat(shuttleUncoveredValues[25]),
          day27Price: parseFloat(shuttleUncoveredValues[26]),
          day28Price: parseFloat(shuttleUncoveredValues[27]),
          day29Price: parseFloat(shuttleUncoveredValues[28]),
          day30Price: parseFloat(shuttleUncoveredValues[29]),
          extraDayPrice: parseFloat(shuttleUncoveredValues[30]),
          type: "Valet uncovered"
        };
  
        const updatedGarage = {
          ...payload,
          garage: {
            ...payload.garage,
            account: {
              ...payload.garage.account,
              roles: [], // Set roles to an empty array
            },
          },
        };
  
        // Call the createPriceList method from PriceListApi with the adjusted payload
        console.log(updatedGarage)
        await PriceListApi.createPriceList(updatedGarage);
  
        console.log('Price list saved!');
        
        // Refetch existing price lists after saving
        fetchExistingPriceLists();
      } catch (error) {
        console.error('Error saving price list:', error);
        // Add logic to handle error (e.g., show an error message)
      }
    }
    
  };

  const fetchExistingPriceLists = async () => {
    // try {
    //   // Call the method from PriceListApi to fetch existing price lists
    //   const priceLists = await PriceListApi.getAllPriceLists();
    //   setExistingPriceLists(priceLists);
    // } catch (error) {
    //   console.error('Error fetching existing price lists:', error);
    //   // Add logic to handle error (e.g., show an error message)
    // }
  };

  return (
    <div>
      <Grid container justifyContent="center">
        <h1 sx={{ paddingLeft: 31, textAlign: 'center' }}>Parking Garage Pricing</h1>
      </Grid>
      <Grid container spacing={3} sx={{ paddingLeft: 31 }}>

        {/* Row 1: Shuttle Uncovered */}
        <Grid item xs={3}>
          <Typography variant="h6">Shuttle Uncovered</Typography>
          <FormControlLabel
            control={<Checkbox checked={shuttleUncoveredChecked} onChange={(e) => handleCheckboxChange('shuttleUncovered', e.target.checked)} />}
            label="Included"
          />
          {renderInputBoxes('shuttleUncovered', shuttleUncoveredValues, shuttleUncoveredChecked, setShuttleUncoveredValues)}
        </Grid>

        {/* Row 2: Shuttle Covered */}
        <Grid item xs={3}>
          <Typography variant="h6">Shuttle Covered</Typography>
          <FormControlLabel
            control={<Checkbox checked={shuttleCoveredChecked} onChange={(e) => handleCheckboxChange('shuttleCovered', e.target.checked)} />}
            label="Included"
          />
          {renderInputBoxes('shuttleCovered', shuttleCoveredValues, shuttleCoveredChecked, setShuttleCoveredValues)}
        </Grid>

        {/* Row 3: Valet Uncovered */}
        <Grid item xs={3}>
          <Typography variant="h6">Valet Uncovered</Typography>
          <FormControlLabel
            control={<Checkbox checked={valetUncoveredChecked} onChange={(e) => handleCheckboxChange('valetUncovered', e.target.checked)} />}
            label="Included"
          />
          {renderInputBoxes('valetUncovered', valetUncoveredValues, valetUncoveredChecked, setValetUncoveredValues)}
        </Grid>

        {/* Row 4: Date Range */}
        <Grid item xs={3}>
          <Typography variant="h6">Date Range</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']} >
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(props) => <TextField {...props} />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  renderInput={(props) => <TextField {...props} />}
                />
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Grid container justifyContent="center" mt={3}>
        <Button variant="contained" color="primary" onClick={handleSaveButtonClick}>
          Save Price List
        </Button>
      </Grid>

      {failedMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {failedMessage}
              </Alert>
            )}

      {/* Existing Price Lists */}
      {/* <Box mt={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
        <Typography variant="h6">Existing Price Lists</Typography>
        {existingPriceLists.map((priceList) => (
          Display existing price lists, adjust this based on your actual data structure
          <div key={priceList.id}>
            <Typography variant="body1">{`Start Date: ${priceList.startDate}, End Date: ${priceList.endDate}`}</Typography>
            Display other price list details
          </div>
        ))}
      </Box> */}
    </div>
  );
}

export default GaragePricing;
