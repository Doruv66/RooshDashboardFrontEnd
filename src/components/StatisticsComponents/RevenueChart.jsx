import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RevenueChart = ({ data }) => {
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
            labels: data.map((_, index) => `Month ${index + 1}`),
            datasets: [{
              label: 'REVENUE',
              data: data,
              fill: false,
              borderColor: 'rgba(54, 162, 235, 1)',
              tension: 0.1,
            }],
          },
          options: {
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
    }, [data]);

    return (
      <div style={{ width: '550px', height: '450px', marginTop: '30px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    );
};

export default RevenueChart;