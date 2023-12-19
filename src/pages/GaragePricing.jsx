import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Checkbox, FormControlLabel } from '@mui/material';

function GaragePricing() {
  const [shuttleUncoveredChecked, setShuttleUncoveredChecked] = useState(true);
  const [shuttleCoveredChecked, setShuttleCoveredChecked] = useState(true);
  const [valetUncoveredChecked, setValetUncoveredChecked] = useState(true);

  const [shuttleUncoveredValues, setShuttleUncoveredValues] = useState(Array.from({ length: 30 }, () => ''));
  const [shuttleCoveredValues, setShuttleCoveredValues] = useState(Array.from({ length: 30 }, () => ''));
  const [valetUncoveredValues, setValetUncoveredValues] = useState(Array.from({ length: 30 }, () => ''));

  useEffect(() => {
    // Set all items as included when the component mounts
    setShuttleUncoveredChecked(true);
    setShuttleCoveredChecked(true);
    setValetUncoveredChecked(true);
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

  return (
    <div>
      <Grid container justifyContent="center">
        <h1 sx={{ paddingLeft: 31, textAlign: 'center' }}>Parking Garage Pricing</h1>
      </Grid>
      <Grid container spacing={3} sx={{ paddingLeft: 31 }}>

        {/* Row 1: Shuttle Uncovered */}
        <Grid item xs={4}>
          <Typography variant="h6">Shuttle Uncovered</Typography>
          <FormControlLabel
            control={<Checkbox checked={shuttleUncoveredChecked} onChange={(e) => handleCheckboxChange('shuttleUncovered', e.target.checked)} />}
            label="Included"
          />
          {renderInputBoxes('shuttleUncovered', shuttleUncoveredValues, shuttleUncoveredChecked, setShuttleUncoveredValues)}
        </Grid>

        {/* Row 2: Shuttle Covered */}
        <Grid item xs={4}>
          <Typography variant="h6">Shuttle Covered</Typography>
          <FormControlLabel
            control={<Checkbox checked={shuttleCoveredChecked} onChange={(e) => handleCheckboxChange('shuttleCovered', e.target.checked)} />}
            label="Included"
          />
          {renderInputBoxes('shuttleCovered', shuttleCoveredValues, shuttleCoveredChecked, setShuttleCoveredValues)}
        </Grid>

        {/* Row 3: Valet Uncovered */}
        <Grid item xs={4}>
          <Typography variant="h6">Valet Uncovered</Typography>
          <FormControlLabel
            control={<Checkbox checked={valetUncoveredChecked} onChange={(e) => handleCheckboxChange('valetUncovered', e.target.checked)} />}
            label="Included"
          />
          {renderInputBoxes('valetUncovered', valetUncoveredValues, valetUncoveredChecked, setValetUncoveredValues)}
        </Grid>
      </Grid>
    </div>
  );
}

function renderInputBoxes(prefix, values, editable, setValues) {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  const handleInputChange = (index) => (event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
  };

  return days.map((day, index) => (
    <TextField
      key={day}
      label={`Day ${day}`}
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={values[index]}
      onChange={handleInputChange(index)}
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
      onChange={handleInputChange(30)}
      InputProps={{ inputProps: { min: 0 }, readOnly: !editable }}
      sx={{ backgroundColor: !editable ? '#f2f2f2' : 'inherit' }}
    />
  );
}

export default GaragePricing;