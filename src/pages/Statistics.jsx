import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { useParkingGarage } from "../components/ParkingGarageContext";
import Header from '../components/StatisticsComponents/Header';
import StatCard from '../components/StatisticsComponents/StatCard';
import RevenueChart from '../components/StatisticsComponents/RevenueChart';
import OrdersChart from '../components/StatisticsComponents/OrdersChart';
import BookingApi from '../api/BookingApi';
import { getDateRange } from '../components/StatisticsComponents/getDateRange'; 

const Statistics = () => {
  const { parkingGarage } = useParkingGarage();
  const [range, setRange] = useState('This Week'); 
  const [stats, setStats] = useState({
    orders: 0,
    revenue: '0,00',
    orderValue: '0,00',
    revenueData: [],
    ordersData: [],
  });

  useEffect(() => {
    if (parkingGarage && range) {
      const { startDate } = getDateRange(range);
      const garageId = parkingGarage.id;
      
      const fetchStats = async () => {
        try {
          const response = await BookingApi.getBookingStatistics(startDate, garageId);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const fetchedStats = await response.json();
          if (fetchedStats && fetchedStats.statisticsMap) {
            const statisticsArray = Object.values(fetchedStats.statisticsMap);
            const ordersData = statisticsArray.map(stat => stat.numOfBookings);
            const revenueData = statisticsArray.map(stat => stat.revenue);
      
            setStats(prevStats => ({
              ...prevStats,
              orders: ordersData.reduce((a, b) => a + b, 0),
              revenue: revenueData.reduce((a, b) => a + b, 0).toFixed(2),
              revenueData,
              ordersData,
            }));
          }
        } catch (error) {
          console.error('Error fetching statistics:', error);
        }
      };
      
  
      fetchStats();
    }
  }, [parkingGarage, range]);

  return (
    <Container sx={{ zIndex: '200', marginLeft: '15%' }}>
      <Header range={range} setRange={setRange} />
      <Container sx={{ display: 'flex', gap: 3 }}>
        <StatCard title={'ORDERS'} number={stats.orders} />
        <StatCard title={'REVENUE'} number={stats.revenue} />
        <StatCard title={'ORDERVALUE'} number={stats.orderValue} />
      </Container>
      <Container sx={{ display: 'flex' }}>
        <RevenueChart data={stats.revenueData} />
        <OrdersChart data={stats.ordersData} />
      </Container>
    </Container>
  );
};

export default Statistics;
