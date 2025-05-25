import { api } from './api'; // Changed to named import
import { Produto, ProdutoFormData } from '@/types/entities';

const BASE_URL = '/api/produtos'; // Adjusted BASE_URL

export const produtoService = {
  listarProdutos: async (): Promise<Produto[]> => {
    const response = await api.get<Produto[]>(BASE_URL);
    return response.data;
  },

  obterProdutoPorId: async (id: string): Promise<Produto> => {
    const response = await api.get<Produto>(`${BASE_URL}/${id}`);
    return response.data;
  },

  criarProduto: async (data: ProdutoFormData): Promise<Produto> => {
    const response = await api.post<Produto>(BASE_URL, data);
    return response.data;
  },

  atualizarProduto: async (id: string, data: Partial<ProdutoFormData>): Promise<Produto> => {
    const response = await api.put<Produto>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Soft delete, API returns 204 No Content
  deletarProduto: async (id: string): Promise<void> => { // Adjusted return type
    await api.delete(`${BASE_URL}/${id}`);
  },
  
  // Se precisar reativar um produto (caso a API suporte)
  /*
  reativarProduto: async (id: string): Promise<Produto> => {
    // Esta rota/lógica precisaria ser implementada na API, por exemplo, com um PATCH ou um PUT específico
    // Exemplo: PUT /api/produtos/[id]/reactivate
    // Por ora, vamos simular atualizando o campo 'ativo' se a API permitir via PUT geral
    // const response = await api.put<Produto>(`${BASE_URL}/${id}`, { ativo: true });
    // return response.data;
    throw new Error("Reativar produto não implementado no backend.");
  }
  */
};
