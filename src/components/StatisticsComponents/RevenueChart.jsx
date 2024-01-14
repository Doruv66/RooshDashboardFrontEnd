import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RevenueChart = ({ data, labels }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const containerStyles = {
      width: '550px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '450px',
      marginTop: '30px',
    };
  
    const headingStyles = {
      letterSpacing: 2,
    };
  
    // Adjust styles for screens with a width of 550px
    if (window.innerWidth <= 550) {
      containerStyles.width = '400px';
    }
  
    // Adjust styles for screens with a width of 400px
    if (window.innerWidth <= 400) {
      containerStyles.width = '450px';
      headingStyles.fontSize = '12px';
    }

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
      <div style={containerStyles}>
      <h4 style={headingStyles}>REVENUE</h4>
      <canvas ref={chartRef}></canvas>
    </div>
    );
};

export default RevenueChart;