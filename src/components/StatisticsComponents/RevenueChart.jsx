import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RevenueChart = ({ data, labels }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'REVENUE',
              data: data,
              fill: false,
              borderColor: 'rgba(54, 162, 235, 1)',
              tension: 0.1,
            }],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
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
      <div style={{ width: '550px',display: 'flex', flexDirection: 'column', alignItems: 'center', height: '450px', marginTop: '30px' }}>
        <h4 style={{letterSpacing: 2}}>REVENUE</h4>
        <canvas ref={chartRef}></canvas>
      </div>
    );
};

export default RevenueChart;