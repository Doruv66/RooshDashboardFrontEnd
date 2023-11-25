import { Container, Box} from '@mui/material';

import React from 'react'
import Header from '../components/ArrivalsDepartures/Header';
import TodaysCard from '../components/ArrivalsDepartures/TodaysCard';
import TomorrowsCard from '../components/ArrivalsDepartures/TomorrowsCard';
import CustomCard from '../components/ArrivalsDepartures/CustomCard';

const DeparturesAndArrivals = () => {
    

  return (
    <Container sx={{zIndex: '200',marginLeft: '15%'}}>
        <Header />
        <Box sx={{display: 'flex', justifyContent: 'space-around'}}>  
            {/* Here the cards will go */}
            <TodaysCard />
            <TomorrowsCard />
            <CustomCard />
        </Box>
    </Container>
  )
}

export default DeparturesAndArrivals