import { Container } from '@mui/material'
import React from 'react'
import Header from '../components/StatisticsComponents/Header'
import StatCard from '../components/StatisticsComponents/StatCard'
import RevenueChart from '../components/StatisticsComponents/RevenueChart'
import OrdersChart from '../components/StatisticsComponents/OrdersChart'

const Statistics = () => {
  return (
    <Container sx={{zIndex: '200',marginLeft: '15%'}}>
        <Header />
        {/* 3 cards for orders revenue and order value  */}
        <Container sx={{display: 'flex', gap: 3}}>
            <StatCard title={'ORDERS'} number={0}/>
            <StatCard title={'REVENUE'} number={'0,00'}/>
            <StatCard title={'ORDERVALUE'} number={'0,00'}/>
        </Container>
        {/* Revenue and Orders for selected range of time  */}
        <Container sx={{display: 'flex'}}>
            <RevenueChart />
            <OrdersChart /> 
        </Container>
        {/* Capacity overview per service  */}
    </Container>
  )
}

export default Statistics