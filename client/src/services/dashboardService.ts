import { api } from './api';

export interface DashboardData {
  totalProducts: number;
  totalStockValue: number;
  lowStockItems: number;
  monthlyEntries: number;
  monthlyExits: number;
  topStockedProducts: { name: string; quantity: number }[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },
};
