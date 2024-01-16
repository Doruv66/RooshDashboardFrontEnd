import { Container, Grid, useMediaQuery} from '@mui/material';
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

    const isSmallScreen = useMediaQuery('(max-width:1150px)');


    return (
      <Container sx={{ zIndex: '200', marginLeft: '15%', padding: '20px' }}>
          <Header title={title} option={option} setOption={setOption}/>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} md={isSmallScreen ? 6 : 4}>
                  <TodaysCard setData={setArrivalsDepartures} setTitle={setTitle} filters={filters}/>
              </Grid>
              <Grid item xs={12} sm={6} md={isSmallScreen ? 6 : 4}>
                  <TomorrowsCard setData={setArrivalsDepartures} setTitle={setTitle} filters={filters}/>
              </Grid>
              <Grid item xs={12} sm={6} md={isSmallScreen ? 6 : 4}>
                  <CustomCard setData={setArrivalsDepartures} setTitle={setTitle} filters={filters}/>
              </Grid>
          </Grid>
          <DataTable bookings={arrivalsDepartures !== null ? option ? arrivalsDepartures.arrivals : arrivalsDepartures.departures : []} option={option}/>
      </Container>
  )
}

export default DeparturesAndArrivals;