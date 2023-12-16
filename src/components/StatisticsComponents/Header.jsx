import { Container, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useState } from 'react'

const Header = () => {
    const [range, setRange] = useState('');

    const handleRangeChange = (event) => {
        setRange(event.target.value);
    }
  return (
    <Container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Container>
            <Typography sx={{fontWeight: 'bold', fontSize: '20px'}}>
                Welcome back,
            </Typography>
            <Typography>
                The results for Acceptancetest:
            </Typography>
        </Container>
        <Typography variant='h8' fontWeight={400} marginRight={2}>Range: </Typography>
            <FormControl sx={{width: '250px', height: '40px', marginTop: '10px'}}>
                        <InputLabel id="demo-simple-select-label" size='small'>Range</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={range}
                                onChange={handleRangeChange}
                                label="Service"     
                                slotProps={{ InputLabel: { size: 'small' } }}
                                style={{height: '40px'}}
                            >
                            <MenuItem value={"This Week"} >This Week</MenuItem>
                            <MenuItem value={"Last Week"} >Last Week</MenuItem>
                            <MenuItem value={"This Month"} >This Month</MenuItem>
                            <MenuItem value={"Last Month"} >Last Month</MenuItem>
                            <MenuItem value={"This Year"} >This Year</MenuItem>
                            <MenuItem value={"Last Year"} >Last Year</MenuItem>
                        </Select>
                    </FormControl>
    </Container>
  )
}

export default Header