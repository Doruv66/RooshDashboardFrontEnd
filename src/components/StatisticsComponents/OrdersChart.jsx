import React from 'react'
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

const OrdersChart = () => {
 const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
            label: 'ORDERS', 
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(54, 162, 235, 1)', // Blue color
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          indexAxis: 'x', 
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '550px', height: '450px', marginTop: '30px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <h3 style={{letterSpacing: '1px'}}>ORDERS</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default OrdersChart