import React, { useEffect, useState } from "react";
import { Container, Grid, useMediaQuery  } from "@mui/material";
import { useParkingGarage } from "../components/ParkingGarageContext";
import Header from "../components/StatisticsComponents/Header";
import StatCard from "../components/StatisticsComponents/StatCard";
import RevenueChart from "../components/StatisticsComponents/RevenueChart";
import OrdersChart from "../components/StatisticsComponents/OrdersChart";
import BookingApi from "../api/BookingApi";
import { getDateRange } from "../components/StatisticsComponents/getDateRange";

const getMonthLabels = (statisticsMap) => {
  const monthLabels = [];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dates = Object.keys(statisticsMap).map((dateStr) => new Date(dateStr));

  dates.sort((a, b) => a - b);
  dates.forEach((date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const label = `${months[month]} ${year}`;
    if (!monthLabels.includes(label)) {
      monthLabels.push(label);
    }
  });

  return monthLabels;
};

const Statistics = () => {
  const { parkingGarage } = useParkingGarage();
  const [range, setRange] = useState("This Week");
  const [stats, setStats] = useState({
    orders: 0,
    revenue: "0,00",
    orderValue: "0,00",
    revenueData: [],
    ordersData: [],
    monthLabels: [],
  });

  useEffect(() => {
    if (parkingGarage && range) {
      const { startDate } = getDateRange(range);
      const garageId = parkingGarage.id;

      const fetchStats = async () => {
        try {
          const response = await BookingApi.getBookingStatistics(
            startDate,
            garageId
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const fetchedStats = await response.json();
          if (fetchedStats && fetchedStats.statisticsMap) {
            const statisticsArray = Object.values(fetchedStats.statisticsMap);
            const ordersData = statisticsArray.map(
              (stat) => stat.numOfBookings
            );
            const revenueData = statisticsArray.map((stat) => stat.revenue);

            const totalOrders = ordersData.reduce((a, b) => a + b, 0);
            const totalRevenue = revenueData.reduce((a, b) => a + b, 0);
            const orderValue =
              totalOrders > 0
                ? (totalRevenue / totalOrders).toFixed(2)
                : "0,00";

            const monthLabels = getMonthLabels(fetchedStats.statisticsMap);

            setStats({
              orders: totalOrders,
              revenue: totalRevenue.toFixed(2),
              orderValue,
              revenueData,
              ordersData,
              monthLabels,
            });
          }
        } catch (error) {
          console.error("Error fetching statistics:", error);
        }
      };

      fetchStats();
    }
  }, [parkingGarage, range]);

  const isSmallScreen = useMediaQuery('(max-width:1100px)');

  return (
    <Container
      sx={{ zIndex: "200", marginLeft: ["0%", "15%"], padding: "20px" }}
    >
      <Header range={range} setRange={setRange} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={4}>
          <StatCard title={"ORDERS"} number={stats.orders} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatCard title={"REVENUE"} number={stats.revenue} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatCard title={"ORDERVALUE"} number={stats.orderValue} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={isSmallScreen ? 12 : 6}>
          <RevenueChart data={stats.revenueData} labels={stats.monthLabels} />
        </Grid>
        <Grid item xs={12} md={isSmallScreen ? 12 : 6}>
          <OrdersChart data={stats.ordersData} labels={stats.monthLabels} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;
