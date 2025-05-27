export interface Fornecedor {
  id: string; // Assuming Fornecedor ID might remain string, adjust if needed
  nome: string;
  contatoNome?: string;
  contatoEmail?: string;
  contatoTelefone?: string;
}

export interface Produto {
  id: number; // Changed from string to number
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

export interface FornecedorComKey extends Fornecedor {
  key: string;
}

export interface ProdutoComKey extends Produto {
  key: string;
  id: number; // Ensure consistency
}
