import { Container, Box} from '@mui/material';

import React, { useState, useEffect } from 'react'
import Header from '../components/ArrivalsDepartures/Header';
import TodaysCard from '../components/ArrivalsDepartures/TodaysCard';
import TomorrowsCard from '../components/ArrivalsDepartures/TomorrowsCard';
import CustomCard from '../components/ArrivalsDepartures/CustomCard';
import DataTable from '../components/ArrivalsDepartures/DataTable';
import { useParkingGarage } from '../components/ParkingGarageContext';
import { useNavigate } from 'react-router-dom';


const DeparturesAndArrivals = () => {
    const { filters } = useParkingGarage();
    const [arrivalsDepartures, setArrivalsDepartures] = useState(null);
    const [option, setOption] = useState(true);
    const [title, setTitle] = useState('Today');
    const navigate = useNavigate()

    useEffect(() => {
      console.log(filters)
      navigate("/departuresandarrivals");
    }, [filters])

  return (
    <Container sx={{zIndex: '200',marginLeft: '15%'}}>
        <Header title={title} option={option} setOption={setOption}/>
        <Box sx={{display: 'flex', justifyContent: 'space-around', flexDirection: ['column', 'row']}}>  
            <TodaysCard setData={setArrivalsDepartures} setTitle={setTitle} filters={filters}/>
            <TomorrowsCard setData={setArrivalsDepartures} setTitle={setTitle} filters={filters}/>
            <CustomCard setData={setArrivalsDepartures} setTitle={setTitle} filters={filters}/>
        </Box>
        <DataTable bookings={arrivalsDepartures !== null ? option ? arrivalsDepartures.arrivals : arrivalsDepartures.departures : []} option={option}/>
    </Container>
  )
}

export default DeparturesAndArrivals