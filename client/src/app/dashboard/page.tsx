"use client";

import { useEffect, useState } from 'react';
import { BriefcaseIcon, ArchiveBoxIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import OverviewCard from './components/OverviewCard';
import StockLevelsChart from './components/StockLevelsChart';
import { useTitle } from '@/contexts/TitleContext';
import { dashboardService, DashboardData } from '@/services/dashboardService';
import { Spin, Alert } from 'antd';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setError('Falha ao carregar dados do dashboard. Tente novamente.');
        // Fallback para dados mock em caso de erro
        setDashboardData({
          totalProducts: 150,
          totalStockValue: 125500.75,
          lowStockItems: 12,
          monthlyEntries: 58,
          monthlyExits: 45,
          topStockedProducts: [
            { name: 'Notebook Gamer XYZ', quantity: 75 },
            { name: 'Mouse Sem Fio Ergonômico', quantity: 120 },
            { name: 'Teclado Mecânico RGB', quantity: 90 },
            { name: 'Monitor Ultrawide 34"', quantity: 45 },
            { name: 'SSD NVMe 1TB', quantity: 200 },
          ].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Alert
        message="Erro"
        description="Não foi possível carregar os dados do dashboard."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      {error && (
        <Alert
          message="Aviso"
          description={error}
          type="warning"
          showIcon
          className="mb-4"
        />
      )}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            <OverviewCard title="Total de Produtos" value={dashboardData.totalProducts} icon={ArchiveBoxIcon} textColor="text-dark" bgColor="bg-primary" />
            <OverviewCard title="Valor do Estoque" value={`R$ ${dashboardData.totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={CurrencyDollarIcon} textColor="text-dark" bgColor="bg-success" />
            <OverviewCard title="Itens com Estoque Baixo" value={dashboardData.lowStockItems} icon={BriefcaseIcon} textColor="text-dark" bgColor="bg-accent" />
            <OverviewCard title="Entradas no Mês" value={dashboardData.monthlyEntries} icon={ArrowTrendingUpIcon} textColor="text-dark" bgColor="bg-info" />
            <OverviewCard title="Saídas no Mês" value={dashboardData.monthlyExits} icon={ArrowTrendingDownIcon} textColor="text-dark" bgColor="bg-danger" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
            <StockLevelsChart data={dashboardData.topStockedProducts} title="Top 5 Produtos com Mais Estoque" />
          </div>
        </div>
      </main>
    </div>
  );
}