export interface Fornecedor {
  id: string;
  nome: string;
  contatoNome?: string;
  contatoEmail?: string;
  contatoTelefone?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque: number;
  unidadeMedida: string; // Ex: "un", "kg", "L", "m"
  fornecedorId?: string; // ID do fornecedor associado
  // Opcional: para mostrar o nome do fornecedor diretamente
  fornecedorNome?: string; 
}

// Para formulários, podemos querer dados parciais ou sem ID
export type ProdutoFormData = Omit<Produto, 'id' | 'fornecedorNome'>;
export type FornecedorFormData = Omit<Fornecedor, 'id'>;
