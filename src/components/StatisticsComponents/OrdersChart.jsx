import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const OrdersChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map((_, index) => `Month ${index + 1}`), // Replace with actual labels if needed
          datasets: [{
            label: 'ORDERS',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 1)',
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
  }, [data]);

  return (
    <div style={{ width: '550px', height: '450px', marginTop: '30px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <h3 style={{letterSpacing: '1px'}}>ORDERS</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default OrdersChart;
