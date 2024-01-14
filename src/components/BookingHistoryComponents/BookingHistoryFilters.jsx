import React, { useState } from 'react'
import style from './BookingHistoryFilters.module.css'
import { Container, InputLabel } from '@mui/material'
import {Select} from '@mui/material'
import {MenuItem} from '@mui/material'
import {FormControl} from '@mui/material'
import {FormControlLabel} from '@mui/material'
import Checkbox from '@mui/material/Checkbox';
import { useParkingGarage } from '../ParkingGarageContext.jsx'; 

const BookingHistoryFilters = ({ onSortChange }) => {
  const { updateFilters } = useParkingGarage();
  
  const [state, setState] = useState({
    ongoing:false,
    completed: false
  });

  const [serviceType, setServiceType] = useState('');
  const [sortBy, setSortBy] = useState('');


  const handleCheckboxChange = (event) => {
    const newState = {
        ...state,
        [event.target.name]: event.target.checked,
    };
    setState(newState);

    // Update filters based on the checkbox name
    if (event.target.name === 'completed') {
        updateFilters({ finished: event.target.checked });
    } else if (event.target.name === 'ongoing') {
        updateFilters({ ongoing: event.target.checked });
    }
};

const handleSortByChange = (event) => {
  setSortBy(event.target.value);
  onSortChange(event.target.value); // Update parent component
}

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
    updateFilters({ service: event.target.value }); // update the filter
  };


  return (
    <Container sx={{
      display: 'flex',
      flexDirection: ['column', 'row'], 
      alignItems: 'center',
      justifyContent: ['space-around', 'space-evenly'],
    }}>
        <FormControl fullWidth sx={{width: 250, margin: 1}}>
          <InputLabel id="sort-select-label" sx={{paddingLeft: '20px'}}>Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortBy}
            label="Sort By"
            onChange={handleSortByChange}
          >
            <MenuItem value={"startDateAsc"}>Arrival Day (Asc)</MenuItem>
            <MenuItem value={"startDateDesc"}>Arrival Day (Desc)</MenuItem>
            <MenuItem value={"endDateAsc"}>Departure Day (Asc)</MenuItem>
            <MenuItem value={"endDateDesc"}>Departure Day (Desc)</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{width: 200}}>
          <InputLabel id="demo-simple-select-label" sx={{pl: 2.5}}>Service</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={serviceType}
            label="Service"
            onChange={handleServiceTypeChange}
          >
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Valet"}>Valet</MenuItem>
            <MenuItem value={"Shuttle"}>Shuttle</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
      control={
        <Checkbox checked={state.ongoing} onChange={handleCheckboxChange} name="ongoing" />
      }
      label="Ongoing"
    />
    <FormControlLabel
      control={
        <Checkbox checked={state.completed} onChange={handleCheckboxChange} name="completed" />
      }
      label="Completed"
    />
    </Container>
  )
}

export default BookingHistoryFilters