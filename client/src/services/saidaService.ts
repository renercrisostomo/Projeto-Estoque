// src/services/saidaService.ts
import { api } from './api';
import { SaidaProduto, SaidaProdutoFormData } from '@/types/entities';

const BASE_URL = '/api/saidas'; // Ajuste conforme sua API

export const saidaService = {
  listarSaidas: async (): Promise<SaidaProduto[]> => {
    const response = await api.get<SaidaProduto[]>(BASE_URL);
    return response.data;
  },

  obterSaidaPorId: async (id: string): Promise<SaidaProduto> => {
    const response = await api.get<SaidaProduto>(`${BASE_URL}/${id}`);
    return response.data;
  },

  criarSaida: async (data: SaidaProdutoFormData): Promise<SaidaProduto> => {
    const response = await api.post<SaidaProduto>(BASE_URL, data);
    return response.data;
  },

  atualizarSaida: async (id: string, data: Partial<SaidaProdutoFormData>): Promise<SaidaProduto> => {
    const response = await api.put<SaidaProduto>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deletarSaida: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};
