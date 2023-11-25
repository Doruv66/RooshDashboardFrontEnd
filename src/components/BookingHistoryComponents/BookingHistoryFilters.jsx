import React, { useState } from 'react'
import style from './BookingHistoryFilters.module.css'
import { InputLabel } from '@mui/material'
import {Select} from '@mui/material'
import {MenuItem} from '@mui/material'
import {FormControl} from '@mui/material'
import {FormControlLabel} from '@mui/material'
import Checkbox from '@mui/material/Checkbox';
import { useParkingGarage } from '../ParkingGarageContext.jsx'; 

const BookingHistoryFilters = () => {
  const { updateFilters } = useParkingGarage();
  const [state, setState] = useState({
    ongoing:false,
    completed: false
  });

  const [serviceType, setServiceType] = useState('');
  const [sortBy, setSortBy] = useState('');


  const handleCheckboxChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
    updateFilters({ [event.target.name]: event.target.checked }); // update the filter
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  }

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
    updateFilters({ service: event.target.value }); // update the filter
  };


  return (
    <div className={style.filters}>
        <FormControl fullWidth sx={{width: 250}}>
          <InputLabel id="demo-simple-select-label" sx={{pl: 2.5}}>Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortBy}
            label="Service"
            onChange={handleSortByChange}
          >
            <MenuItem value={"Arrival Day (asc)"}>Arrival Day (asc)</MenuItem>
            <MenuItem value={"Departure Day (asc)"}>Departure Day (asc)</MenuItem>
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
    </div>
  )
}

export default BookingHistoryFilters