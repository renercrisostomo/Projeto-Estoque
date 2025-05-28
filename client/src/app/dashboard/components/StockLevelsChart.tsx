// filepath: c:\\Rener-SSD\\github\\projeto-estoque\\client\\src\\app\\dashboard\\components\\StockLevelsChart.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import ApexCharts to prevent SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface StockLevelData { // Exporting the interface
  name: string;
  quantity: number;
}

interface StockLevelsChartProps {
  data: StockLevelData[];
  title?: string;
}

const StockLevelsChart: React.FC<StockLevelsChartProps> = ({ data, title = 'Níveis de Estoque' }) => {
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: data.map(p => p.name),
      title: {
        text: 'Quantidade em Estoque'
      }
    },
    yaxis: {
      labels: {
        maxWidth: 200, 
        style: {
          fontSize: '10px',
        }
      }
    },
    colors: ['#3B82F6'], 
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " unidades"
        }
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      }
    }
  };

  const chartSeries = [{
    name: 'Quantidade',
    data: data.map(p => p.quantity)
  }];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {typeof window !== 'undefined' && (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={380}
        />
      )}
    </div>
  );
};

export default StockLevelsChart;
