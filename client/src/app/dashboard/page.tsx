"use client";

import { useEffect, useState } from 'react';
import { BriefcaseIcon, ArchiveBoxIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import OverviewCard from './components/OverviewCard';
import StockLevelsChart, { StockLevelData } from './components/StockLevelsChart'; // Import StockLevelData

export default function Dashboard() {
  // Mock data - Replace with API calls in the future
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [monthlyEntries, setMonthlyEntries] = useState(0);
  const [monthlyExits, setMonthlyExits] = useState(0);

  const [topStockedProducts, setTopStockedProducts] = useState<StockLevelData[]>([]); // Use imported StockLevelData

  useEffect(() => {
    // Simulate fetching data
    // TODO: Replace with actual API calls to your backend
    setTotalProducts(150);
    setTotalStockValue(125500.75);
    setLowStockItems(12);
    setMonthlyEntries(58);
    setMonthlyExits(45);

    setTopStockedProducts([
      { name: 'Notebook Gamer XYZ', quantity: 75 },
      { name: 'Mouse Sem Fio Ergonômico', quantity: 120 },
      { name: 'Teclado Mecânico RGB', quantity: 90 },
      { name: 'Monitor Ultrawide 34"', quantity: 45 },
      { name: 'SSD NVMe 1TB', quantity: 200 },
    ].sort((a, b) => b.quantity - a.quantity).slice(0, 5)); // Get top 5
  }, []);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8"> {/* Changed to sm:grid-cols-2 and removed lg/xl specific column counts */}
            <OverviewCard title="Total de Produtos" value={totalProducts} icon={ArchiveBoxIcon} textColor="text-dark" bgColor="bg-primary" />
            <OverviewCard title="Valor do Estoque" value={`R$ ${totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={CurrencyDollarIcon} textColor="text-dark" bgColor="bg-success" />
            <OverviewCard title="Itens com Estoque Baixo" value={lowStockItems} icon={BriefcaseIcon} textColor="text-dark" bgColor="bg-accent" /> {/* Added textColor="text-dark" */}
            <OverviewCard title="Entradas no Mês" value={monthlyEntries} icon={ArrowTrendingUpIcon} textColor="text-dark" bgColor="bg-info" />
            <OverviewCard title="Saídas no Mês" value={monthlyExits} icon={ArrowTrendingDownIcon} textColor="text-dark" bgColor="bg-danger" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-1"> {/* Adjust grid for more charts later */}
            <StockLevelsChart data={topStockedProducts} title="Top 5 Produtos com Mais Estoque" />
            
            {/* Placeholder for more charts */}
            {/* 
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900">Outro Gráfico Aqui</h3>
              <div className="h-80 border-2 border-dashed border-gray-300 rounded-md mt-4 flex items-center justify-center">
                <p className="text-gray-500">Em breve...</p>
              </div>
            </div>
            */}
          </div>
        </div>
      </main>
    </div>
  );
}