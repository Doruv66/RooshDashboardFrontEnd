import React from 'react'
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RevenueChart = () => {
    const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
            label: 'REVENUE', 
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.1,
            showLine: true, // Show the line
            pointRadius: 0, // Hide the data points
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend
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
        <h3 style={{letterSpacing: '1px'}}>REVENUE</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default RevenueChart