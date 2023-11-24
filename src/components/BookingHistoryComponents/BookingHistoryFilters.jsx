import React, { useState } from 'react'
import style from './BookingHistoryFilters.module.css'
import { InputLabel } from '@mui/material'
import {Select} from '@mui/material'
import {MenuItem} from '@mui/material'
import {FormControl} from '@mui/material'
import {FormControlLabel} from '@mui/material'
import Checkbox from '@mui/material/Checkbox';

const BookingHistoryFilters = () => {
  const [state, setState] = useState({
    ongoing:false,
    completed: false
  });

  const [serviceType, setServiceType] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  }

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
  }


  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
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
            <MenuItem value={"Valet"}>Valet</MenuItem>
            <MenuItem value={"Shuttle"}>Shuttle</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
            control={
              <Checkbox checked={state.ongoing} onChange={handleChange} name="ongoing" />
            }
            label="Ongoing"
          />
          <FormControlLabel
            control={
              <Checkbox checked={state.completed} onChange={handleChange} name="completed" />
            }
            label="Completed"
          />
    </div>
  )
}

export default BookingHistoryFilters