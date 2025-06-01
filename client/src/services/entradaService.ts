// src/services/entradaService.ts
import { api } from './api';
import { EntradaProduto, EntradaProdutoFormData } from '@/types/entities';

const BASE_URL = '/api/entradas'; // Ajuste conforme sua API

export const entradaService = {
  listarEntradas: async (): Promise<EntradaProduto[]> => {
    const response = await api.get<EntradaProduto[]>(BASE_URL);
    return response.data;
  },

  obterEntradaPorId: async (id: number): Promise<EntradaProduto> => {
    const response = await api.get<EntradaProduto>(`${BASE_URL}/${id}`);
    return response.data;
  },

  criarEntrada: async (data: EntradaProdutoFormData): Promise<EntradaProduto> => {
    const response = await api.post<EntradaProduto>(BASE_URL, data);
    return response.data;
  },

  atualizarEntrada: async (id: number, data: Partial<EntradaProdutoFormData>): Promise<EntradaProduto> => {
    const response = await api.put<EntradaProduto>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deletarEntrada: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};
