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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


function GaragePricing() {
  const { parkingGarage, setParkingGarage } = useParkingGarage();
  const [shuttleUncoveredChecked, setShuttleUncoveredChecked] = useState(true);
  const [shuttleCoveredChecked, setShuttleCoveredChecked] = useState(true);
  const [valetUncoveredChecked, setValetUncoveredChecked] = useState(true);
  const [failedMessage, setFailedMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [shuttleUncoveredValues, setShuttleUncoveredValues] = useState(Array.from({ length: 30 }, () => ''));
  const [shuttleCoveredValues, setShuttleCoveredValues] = useState(Array.from({ length: 30 }, () => ''));
  const [valetUncoveredValues, setValetUncoveredValues] = useState(Array.from({ length: 30 }, () => ''));

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [parkingGarages, setParkingGarages] = useState([]);

  const [currentPriceLists, setCurrentPriceLists] = useState([]);

  const [editMode, setEditMode] = useState(false);

  const [shuttleUncovered, setShuttleUncovered] = useState([]);
  const [shuttleCovered, setShuttleCovered] = useState([]);
  const [valetUncovered, setValetUncovered] = useState([]);

  // const[shuttleUncovered, setShuttleUncovered] = useState(null);
  // const[shuttleCovered, setShuttleCovered] = useState(null);
  // const[valetUncovered, setvaletUncovered] = useState(null);

  

  const handleResponse = response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  // const getParkingGarage = () => {
  //   const userId = TokenManager.getClaims().id;
  //   ParkingGarageApi.getParkingGaragesByUserId(userId)
  //   .then(handleResponse)
  //   .then(data => {
  //       if(data.parkingGarages){
  //         setParkingGarages(data.parkingGarages);
  //         console.log("Succesfully fetched all parking garages", data.parkingGarages);
  //       }
  //       else{
  //         setParkingGarages([]);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching the parking garages:', error);        
  //       setError('An error occurred while fetching data.');
  //     })
  // }

  useEffect(() => {
    // Set all items as included when the component mounts
    setShuttleUncoveredChecked(true);
    setShuttleCoveredChecked(true);
    setValetUncoveredChecked(true);


   
  }, []);

  useEffect(() => {
    fetchExistingPriceLists();
  }, [parkingGarage]);


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
    if (editMode) {
      // Execute different save function for edit mode
      handleEditSave();
    } else {
      // Execute the normal save function
      handleNormalSave();
    }
    
  };


  const handleNormalSave = async () => {
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

            const isDateOverlap =
              (newStartDate >= priceListStartDate && newStartDate <= priceListEndDate) ||
              (newEndDate >= priceListStartDate && newEndDate <= priceListEndDate) ||
              (newStartDate <= priceListStartDate && newEndDate >= priceListEndDate);

            const isGarageOverlap = priceList.garage.id === parkingGarage.id;
            const isTypeOverlap = priceList.type === "Shuttle uncovered";

            return isDateOverlap && isGarageOverlap && isTypeOverlap;
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
        setSuccessMessage("Successfully saved new price list");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
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

            const isDateOverlap =
              (newStartDate >= priceListStartDate && newStartDate <= priceListEndDate) ||
              (newEndDate >= priceListStartDate && newEndDate <= priceListEndDate) ||
              (newStartDate <= priceListStartDate && newEndDate >= priceListEndDate);

            const isGarageOverlap = priceList.garage.id === parkingGarage.id;
            const isTypeOverlap = priceList.type === "Shuttle covered";

      

            return isDateOverlap && isGarageOverlap && isTypeOverlap;
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
          day1Price: parseFloat(shuttleCoveredValues[0]),
          day2Price: parseFloat(shuttleCoveredValues[1]),
          day3Price: parseFloat(shuttleCoveredValues[2]),
          day4Price: parseFloat(shuttleCoveredValues[3]),
          day5Price: parseFloat(shuttleCoveredValues[4]),
          day6Price: parseFloat(shuttleCoveredValues[5]),
          day7Price: parseFloat(shuttleCoveredValues[6]),
          day8Price: parseFloat(shuttleCoveredValues[7]),
          day9Price: parseFloat(shuttleCoveredValues[8]),
          day10Price: parseFloat(shuttleCoveredValues[9]),
          day11Price: parseFloat(shuttleCoveredValues[10]),
          day12Price: parseFloat(shuttleCoveredValues[11]),
          day13Price: parseFloat(shuttleCoveredValues[12]),
          day14Price: parseFloat(shuttleCoveredValues[13]),
          day15Price: parseFloat(shuttleCoveredValues[14]),
          day16Price: parseFloat(shuttleCoveredValues[15]),
          day17Price: parseFloat(shuttleCoveredValues[16]),
          day18Price: parseFloat(shuttleCoveredValues[17]),
          day19Price: parseFloat(shuttleCoveredValues[18]),
          day20Price: parseFloat(shuttleCoveredValues[19]),
          day21Price: parseFloat(shuttleCoveredValues[20]),
          day22Price: parseFloat(shuttleCoveredValues[21]),
          day23Price: parseFloat(shuttleCoveredValues[22]),
          day24Price: parseFloat(shuttleCoveredValues[23]),
          day25Price: parseFloat(shuttleCoveredValues[24]),
          day26Price: parseFloat(shuttleCoveredValues[25]),
          day27Price: parseFloat(shuttleCoveredValues[26]),
          day28Price: parseFloat(shuttleCoveredValues[27]),
          day29Price: parseFloat(shuttleCoveredValues[28]),
          day30Price: parseFloat(shuttleCoveredValues[29]),
          extraDayPrice: parseFloat(shuttleCoveredValues[30]),
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
        setSuccessMessage("Successfully saved new price list");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
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

            const isDateOverlap =
              (newStartDate >= priceListStartDate && newStartDate <= priceListEndDate) ||
              (newEndDate >= priceListStartDate && newEndDate <= priceListEndDate) ||
              (newStartDate <= priceListStartDate && newEndDate >= priceListEndDate);

            const isGarageOverlap = priceList.garage.id === parkingGarage.id;
            const isTypeOverlap = priceList.type === "valet uncovered";

            return isDateOverlap && isGarageOverlap && isTypeOverlap;
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
          day1Price: parseFloat(valetUncoveredValues[0]),
          day2Price: parseFloat(valetUncoveredValues[1]),
          day3Price: parseFloat(valetUncoveredValues[2]),
          day4Price: parseFloat(valetUncoveredValues[3]),
          day5Price: parseFloat(valetUncoveredValues[4]),
          day6Price: parseFloat(valetUncoveredValues[5]),
          day7Price: parseFloat(valetUncoveredValues[6]),
          day8Price: parseFloat(valetUncoveredValues[7]),
          day9Price: parseFloat(valetUncoveredValues[8]),
          day10Price: parseFloat(valetUncoveredValues[9]),
          day11Price: parseFloat(valetUncoveredValues[10]),
          day12Price: parseFloat(valetUncoveredValues[11]),
          day13Price: parseFloat(valetUncoveredValues[12]),
          day14Price: parseFloat(valetUncoveredValues[13]),
          day15Price: parseFloat(valetUncoveredValues[14]),
          day16Price: parseFloat(valetUncoveredValues[15]),
          day17Price: parseFloat(valetUncoveredValues[16]),
          day18Price: parseFloat(valetUncoveredValues[17]),
          day19Price: parseFloat(valetUncoveredValues[18]),
          day20Price: parseFloat(valetUncoveredValues[19]),
          day21Price: parseFloat(valetUncoveredValues[20]),
          day22Price: parseFloat(valetUncoveredValues[21]),
          day23Price: parseFloat(valetUncoveredValues[22]),
          day24Price: parseFloat(valetUncoveredValues[23]),
          day25Price: parseFloat(valetUncoveredValues[24]),
          day26Price: parseFloat(valetUncoveredValues[25]),
          day27Price: parseFloat(valetUncoveredValues[26]),
          day28Price: parseFloat(valetUncoveredValues[27]),
          day29Price: parseFloat(valetUncoveredValues[28]),
          day30Price: parseFloat(valetUncoveredValues[29]),
          extraDayPrice: parseFloat(valetUncoveredValues[30]),
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
        setSuccessMessage("Successfully saved new price list");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (error) {
        console.error('Error saving price list:', error);
        // Add logic to handle error (e.g., show an error message)
      }
    }
  };

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };

  const fetchExistingPriceLists = async () => {
    try {
      // Fetch the current parking garage's price lists
      const priceListResponse = await PriceListApi.getPriceListByParkingGarage(parkingGarage.id);
      const priceLists = await priceListResponse.json();
  
      console.log('Existing Price Lists:', priceLists.priceLists);
  
      // Update the state with the fetched price lists
      setCurrentPriceLists(priceLists.priceLists);
  
  
    } catch (error) {
      console.error('Error fetching existing price lists:', error);
      // Add logic to handle error (e.g., show an error message)
    }
  };

  const handleDeleteButtonClick = async (priceList) => {
    try {



      console.log(priceList);
      const response = await PriceListApi.deletePriceList(priceList);
      
      if (response.ok) {
        console.log('Price list deleted successfully');
        setShuttleUncoveredValues(Array.from({ length: 30 }, () => ''));
        setShuttleUncoveredValues((prevValues) => [...prevValues, '']);
        setShuttleCoveredValues(Array.from({ length: 30 }, () => ''));
        setShuttleCoveredValues((prevValues) => [...prevValues, '']);
        setValetUncoveredValues(Array.from({ length: 30 }, () => ''));
        setValetUncoveredValues((prevValues) => [...prevValues, '']);
        // Optionally, you can update your local state or fetch existing price lists again
        fetchExistingPriceLists();
      } else {
        console.error(`Failed to delete price list. HTTP error! Status: ${response.status}`);
        // Handle error scenarios
      }
    } catch (error) {
      console.error('Error deleting price list:', error);
      // Handle error scenarios
    }
  };

  const uniquePriceLists = currentPriceLists.reduce((uniqueLists, priceList) => {
    const hasDuplicate = uniqueLists.some(
      (uniqueList) =>
        uniqueList.startDate === priceList.startDate &&
        uniqueList.endDate === priceList.endDate
    );

    if (!hasDuplicate) {
      uniqueLists.push(priceList);
    }

    return uniqueLists;
  }, []);


  const handleEditButtonClick = async (priceList) => {
    setEditMode(true);
  
    setShuttleUncoveredValues(Array.from({ length: 30 }, () => ''));
    setShuttleUncoveredValues((prevValues) => [...prevValues, '']);
    setShuttleCoveredValues(Array.from({ length: 30 }, () => ''));
    setShuttleCoveredValues((prevValues) => [...prevValues, '']);
    setValetUncoveredValues(Array.from({ length: 30 }, () => ''));
    setValetUncoveredValues((prevValues) => [...prevValues, '']);
  
    const startDate = priceList.startDate;
    const endDate = priceList.endDate;
  
    try {
      const response = await PriceListApi.getPriceListByStartDateEndDate(startDate, endDate);
      const priceListDetails = await response.json();
      console.log(priceListDetails);
  
      // Separate the price lists based on the type
      const shuttleUncoveredPriceList = priceListDetails.priceLists.find(
        (pl) => pl.type === 'Shuttle uncovered'
      );
      const shuttleCoveredPriceList = priceListDetails.priceLists.find(
        (pl) => pl.type === 'Shuttle covered'
      );
      const valetUncoveredPriceList = priceListDetails.priceLists.find(
        (pl) => pl.type === 'Valet uncovered'
      );
  
      console.log(shuttleUncoveredPriceList);
      console.log(shuttleCoveredPriceList);
      console.log(valetUncoveredPriceList);

      setShuttleUncovered(shuttleUncoveredPriceList);
      setShuttleCovered(shuttleCoveredPriceList);
      setValetUncovered(valetUncoveredPriceList);

  
      // Set the state values based on the existing price list details
      if (shuttleUncoveredPriceList) {
        setShuttleUncoveredValues(
          Array.from({ length: 30 }, (_, index) => shuttleUncoveredPriceList[`day${index + 1}Price`])
        );
  
        setShuttleUncoveredValues((prevValues) => [
          ...prevValues,
          shuttleUncoveredPriceList.extraDayPrice // Set value for "After 30 Days"
        ]);
      }
  
      if (shuttleCoveredPriceList) {
        setShuttleCoveredValues(
          Array.from({ length: 30 }, (_, index) => shuttleCoveredPriceList[`day${index + 1}Price`])
        );
  
        setShuttleCoveredValues((prevValues) => [
          ...prevValues,
          shuttleCoveredPriceList.extraDayPrice // Set value for "After 30 Days"
        ]);
      }
  
      if (valetUncoveredPriceList) {
        setValetUncoveredValues(
          Array.from({ length: 30 }, (_, index) => valetUncoveredPriceList[`day${index + 1}Price`])
        );
  
        setValetUncoveredValues((prevValues) => [
          ...prevValues,
          valetUncoveredPriceList.extraDayPrice // Set value for "After 30 Days"
        ]);
      }
  
      // Set the start and end date
      // const startDate = dayjs(priceList.startDate);
      // const endDate = dayjs(priceList.endDate);
    } catch (error) {
      console.error('Error fetching price list details:', error);
      // Handle error scenarios
    }
  };

  const handleEditSave = async () => {
    try {
      if(shuttleUncovered) {
        const priceListId = shuttleUncovered.id;
        
        // Prepare the payload based on the backend entity structure
        const payload = {
          // Adjust the properties as needed
          id: priceListId,
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
  
    
        // Call the updatePriceList method from PriceListApi with the priceListId and updated payload
        await PriceListApi.updatePriceList(priceListId, payload);
    
        console.log('Price list updated!');
        
        // Reset edit mode after saving
        setEditMode(false);
    
        // Refetch existing price lists after saving
        fetchExistingPriceLists();
        setSuccessMessage("Successfully saved new edited price list");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
      if(shuttleCovered) {
        const priceListId = shuttleCovered.id;

        // Prepare the payload based on the backend entity structure
        const payload = {
          // Adjust the properties as needed
          id: priceListId,
          day1Price: parseFloat(shuttleCoveredValues[0]),
          day2Price: parseFloat(shuttleCoveredValues[1]),
          day3Price: parseFloat(shuttleCoveredValues[2]),
          day4Price: parseFloat(shuttleCoveredValues[3]),
          day5Price: parseFloat(shuttleCoveredValues[4]),
          day6Price: parseFloat(shuttleCoveredValues[5]),
          day7Price: parseFloat(shuttleCoveredValues[6]),
          day8Price: parseFloat(shuttleCoveredValues[7]),
          day9Price: parseFloat(shuttleCoveredValues[8]),
          day10Price: parseFloat(shuttleCoveredValues[9]),
          day11Price: parseFloat(shuttleCoveredValues[10]),
          day12Price: parseFloat(shuttleCoveredValues[11]),
          day13Price: parseFloat(shuttleCoveredValues[12]),
          day14Price: parseFloat(shuttleCoveredValues[13]),
          day15Price: parseFloat(shuttleCoveredValues[14]),
          day16Price: parseFloat(shuttleCoveredValues[15]),
          day17Price: parseFloat(shuttleCoveredValues[16]),
          day18Price: parseFloat(shuttleCoveredValues[17]),
          day19Price: parseFloat(shuttleCoveredValues[18]),
          day20Price: parseFloat(shuttleCoveredValues[19]),
          day21Price: parseFloat(shuttleCoveredValues[20]),
          day22Price: parseFloat(shuttleCoveredValues[21]),
          day23Price: parseFloat(shuttleCoveredValues[22]),
          day24Price: parseFloat(shuttleCoveredValues[23]),
          day25Price: parseFloat(shuttleCoveredValues[24]),
          day26Price: parseFloat(shuttleCoveredValues[25]),
          day27Price: parseFloat(shuttleCoveredValues[26]),
          day28Price: parseFloat(shuttleCoveredValues[27]),
          day29Price: parseFloat(shuttleCoveredValues[28]),
          day30Price: parseFloat(shuttleCoveredValues[29]),
          extraDayPrice: parseFloat(shuttleCoveredValues[30]),
          type: "Shuttle covered"
        };
  
    
        // Call the updatePriceList method from PriceListApi with the priceListId and updated payload
        await PriceListApi.updatePriceList(priceListId, payload);
    
        console.log('Price list updated!');
        
        // Reset edit mode after saving
        setEditMode(false);
    
        // Refetch existing price lists after saving
        fetchExistingPriceLists();
        setSuccessMessage("Successfully saved new edited price list");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
      if(valetUncovered) {
        const priceListId = valetUncovered.id;

        // Prepare the payload based on the backend entity structure
        const payload = {
          // Adjust the properties as needed
          id: priceListId,
          day1Price: parseFloat(valetUncoveredValues[0]),
          day2Price: parseFloat(valetUncoveredValues[1]),
          day3Price: parseFloat(valetUncoveredValues[2]),
          day4Price: parseFloat(valetUncoveredValues[3]),
          day5Price: parseFloat(valetUncoveredValues[4]),
          day6Price: parseFloat(valetUncoveredValues[5]),
          day7Price: parseFloat(valetUncoveredValues[6]),
          day8Price: parseFloat(valetUncoveredValues[7]),
          day9Price: parseFloat(valetUncoveredValues[8]),
          day10Price: parseFloat(valetUncoveredValues[9]),
          day11Price: parseFloat(valetUncoveredValues[10]),
          day12Price: parseFloat(valetUncoveredValues[11]),
          day13Price: parseFloat(valetUncoveredValues[12]),
          day14Price: parseFloat(valetUncoveredValues[13]),
          day15Price: parseFloat(valetUncoveredValues[14]),
          day16Price: parseFloat(valetUncoveredValues[15]),
          day17Price: parseFloat(valetUncoveredValues[16]),
          day18Price: parseFloat(valetUncoveredValues[17]),
          day19Price: parseFloat(valetUncoveredValues[18]),
          day20Price: parseFloat(valetUncoveredValues[19]),
          day21Price: parseFloat(valetUncoveredValues[20]),
          day22Price: parseFloat(valetUncoveredValues[21]),
          day23Price: parseFloat(valetUncoveredValues[22]),
          day24Price: parseFloat(valetUncoveredValues[23]),
          day25Price: parseFloat(valetUncoveredValues[24]),
          day26Price: parseFloat(valetUncoveredValues[25]),
          day27Price: parseFloat(valetUncoveredValues[26]),
          day28Price: parseFloat(valetUncoveredValues[27]),
          day29Price: parseFloat(valetUncoveredValues[28]),
          day30Price: parseFloat(valetUncoveredValues[29]),
          extraDayPrice: parseFloat(valetUncoveredValues[30]),
          type: "Valet uncovered"
        };
  
    
        // Call the updatePriceList method from PriceListApi with the priceListId and updated payload
        await PriceListApi.updatePriceList(priceListId, payload);
    
        console.log('Price list updated!');
        
        // Reset edit mode after saving
        setEditMode(false);
    
        // Refetch existing price lists after saving
        fetchExistingPriceLists();
        setSuccessMessage("Successfully saved new edited price list");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
      // Assuming you have the priceListId and parkingGarageId available
    } catch (error) {
      console.error('Error updating price list:', error);
      // Add logic to handle error (e.g., show an error message)
    }
  };

  const handleViewButtonClick = async (priceList) => {
    setEditMode(false);
  
    setShuttleUncoveredValues(Array.from({ length: 30 }, () => ''));
    setShuttleUncoveredValues((prevValues) => [...prevValues, '']);
    setShuttleCoveredValues(Array.from({ length: 30 }, () => ''));
    setShuttleCoveredValues((prevValues) => [...prevValues, '']);
    setValetUncoveredValues(Array.from({ length: 30 }, () => ''));
    setValetUncoveredValues((prevValues) => [...prevValues, '']);
  
    const startDate = priceList.startDate;
    const endDate = priceList.endDate;
  
    try {
      const response = await PriceListApi.getPriceListByStartDateEndDate(startDate, endDate);
      const priceListDetails = await response.json();
      console.log(priceListDetails);
  
      // Separate the price lists based on the type
      const shuttleUncoveredPriceList = priceListDetails.priceLists.find(
        (pl) => pl.type === 'Shuttle uncovered'
      );
      const shuttleCoveredPriceList = priceListDetails.priceLists.find(
        (pl) => pl.type === 'Shuttle covered'
      );
      const valetUncoveredPriceList = priceListDetails.priceLists.find(
        (pl) => pl.type === 'Valet uncovered'
      );
  
      console.log(shuttleUncoveredPriceList);
      console.log(shuttleCoveredPriceList);
      console.log(valetUncoveredPriceList);

      setShuttleUncovered(shuttleUncoveredPriceList);
      setShuttleCovered(shuttleCoveredPriceList);
      setValetUncovered(valetUncoveredPriceList);

  
      // Set the state values based on the existing price list details
      if (shuttleUncoveredPriceList) {
        setShuttleUncoveredValues(
          Array.from({ length: 30 }, (_, index) => shuttleUncoveredPriceList[`day${index + 1}Price`])
        );
  
        setShuttleUncoveredValues((prevValues) => [
          ...prevValues,
          shuttleUncoveredPriceList.extraDayPrice // Set value for "After 30 Days"
        ]);
      }
  
      if (shuttleCoveredPriceList) {
        setShuttleCoveredValues(
          Array.from({ length: 30 }, (_, index) => shuttleCoveredPriceList[`day${index + 1}Price`])
        );
  
        setShuttleCoveredValues((prevValues) => [
          ...prevValues,
          shuttleCoveredPriceList.extraDayPrice // Set value for "After 30 Days"
        ]);
      }
  
      if (valetUncoveredPriceList) {
        setValetUncoveredValues(
          Array.from({ length: 30 }, (_, index) => valetUncoveredPriceList[`day${index + 1}Price`])
        );
  
        setValetUncoveredValues((prevValues) => [
          ...prevValues,
          valetUncoveredPriceList.extraDayPrice // Set value for "After 30 Days"
        ]);
      }
  
      // Set the start and end date
      // const startDate = dayjs(priceList.startDate);
      // const endDate = dayjs(priceList.endDate);
    } catch (error) {
      console.error('Error fetching price list details:', error);
      // Handle error scenarios
    }
  };
  


    if (!parkingGarage) {
      return (
        <div>
          <Typography variant="h4" sx={{ paddingLeft: 31, textAlign: 'center' }}>Please select a parking garage.</Typography>
        </div>
      );
    }


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
          {/* Existing Price Lists */}
        <Grid container justifyContent="flex-end">
          <Box mt={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6">Existing Price Lists</Typography>
            {uniquePriceLists && uniquePriceLists.length > 0 ? (
              <List>
                {uniquePriceLists.map((priceList) => (
                  <ListItem key={priceList.id}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 'bold' }}>{`Start Date: `}</span>
                          {formatDate(priceList.startDate)}
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 'bold' }}>{`End Date: `}</span>
                          {formatDate(priceList.endDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} container justifyContent="flex-end">
                        <IconButton
                          onClick={() => handleViewButtonClick(priceList)}
                          edge="end"
                          aria-label="view"
                        > 
                          <RemoveRedEyeIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditButtonClick(priceList)}
                          edge="end"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteButtonClick(priceList)}
                          edge="end"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No pricing schemes available.</Typography>
            )}
          </Box>
        </Grid>
        </Grid>
      </Grid>

      {/* Save Button */}
      {failedMessage && (
              <Alert severity="error" sx={{ paddingLeft: 31, textAlign: 'center' }}>
                {failedMessage}
              </Alert>
            )}
      {successMessage && (
              <Alert severity="success" sx={{ paddingLeft: 31, textAlign: 'center' }}>
                {successMessage}
              </Alert>
            )}
      <Grid container justifyContent="center" mt={3}>
      <Button variant="contained" color="primary" onClick={handleSaveButtonClick}>
          {editMode ? 'Edit Price List' : 'Save Price List'}
        </Button>
      </Grid>   
    </div>
  );
}

export default GaragePricing;
