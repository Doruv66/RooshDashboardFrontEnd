import { Container, Box} from '@mui/material';

import React, { useState, useEffect } from 'react'
import Header from '../components/ArrivalsDepartures/Header';
import TodaysCard from '../components/ArrivalsDepartures/TodaysCard';
import TomorrowsCard from '../components/ArrivalsDepartures/TomorrowsCard';
import CustomCard from '../components/ArrivalsDepartures/CustomCard';
import DataTable from '../components/ArrivalsDepartures/DataTable';


const DeparturesAndArrivals = () => {
    const [arrivalsDepartures, setArrivalsDepartures] = useState(null);
    const [option, setOption] = useState(true);
    const [title, setTitle] = useState('Today');

  return (
    <Container sx={{zIndex: '200',marginLeft: '15%'}}>
        <Header title={title} option={option} setOption={setOption}/>
        <Box sx={{display: 'flex', justifyContent: 'space-around'}}>  
            {/* Here the cards will go */}
            <TodaysCard setData={setArrivalsDepartures} setTitle={setTitle}/>
            <TomorrowsCard setData={setArrivalsDepartures} setTitle={setTitle}/>
            <CustomCard setData={setArrivalsDepartures} setTitle={setTitle}/>
        </Box>
        {/* table of arrivals or departure based on selected show */}
        <DataTable bookings={arrivalsDepartures !== null ? option ? arrivalsDepartures.arrivals : arrivalsDepartures.departures : []}/>
    </Container>
  )
}

export default DeparturesAndArrivals