import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const OrdersChart = ({ data, labels }) => {
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
          labels: labels,
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
  }, [data, labels]);

  return (
    <div style={{ width: '550px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '450px', marginTop: '30px' }}>
      <h4 style={{letterSpacing: 2}}>ORDERS</h4>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default OrdersChart;