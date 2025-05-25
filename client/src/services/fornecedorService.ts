import { api } from './api'; // Changed to named import
import { Fornecedor, FornecedorFormData } from '@/types/entities';

const BASE_URL = '/api/fornecedores'; // Adjusted BASE_URL

export const fornecedorService = {
  listarFornecedores: async (): Promise<Fornecedor[]> => {
    const response = await api.get<Fornecedor[]>(BASE_URL);
    return response.data;
  },

  obterFornecedorPorId: async (id: string): Promise<Fornecedor> => {
    const response = await api.get<Fornecedor>(`${BASE_URL}/${id}`);
    return response.data;
  },

  criarFornecedor: async (data: FornecedorFormData): Promise<Fornecedor> => {
    const response = await api.post<Fornecedor>(BASE_URL, data);
    return response.data;
  },

  atualizarFornecedor: async (id: string, data: FornecedorFormData): Promise<Fornecedor> => { // Changed data type from Partial<FornecedorFormData>
    const response = await api.put<Fornecedor>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // API returns 204 No Content
  deletarFornecedor: async (id: string): Promise<void> => { // Adjusted return type
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Se precisar reativar um fornecedor
  /*
  reativarFornecedor: async (id: string): Promise<Fornecedor> => {
    // Similar ao produto, a API precisaria de um endpoint ou permitir a reativação via PUT
    // const response = await api.put<Fornecedor>(`${BASE_URL}/${id}`, { ativo: true });
    // return response.data;
    throw new Error("Reativar fornecedor não implementado no backend.");
  }
  */
};
