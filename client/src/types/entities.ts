export interface Fornecedor {
  id: string; // Assuming Fornecedor ID might remain string, adjust if needed
  nome: string;
  contatoNome?: string;
  contatoEmail?: string;
  contatoTelefone?: string;
}

export type FornecedorFormData = Omit<Fornecedor, 'id'>; // ADDED FornecedorFormData

export interface Produto {
  id: number; // Changed from string to number
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque: number;
  unidadeMedida: string; // Ex: "un", "kg", "L", "m"
}

// Para formulários, podemos querer dados parciais ou sem ID
export type ProdutoFormData = Omit<Produto, 'id'>;

export interface FornecedorComKey extends Fornecedor {
  key: string;
}

export interface ProdutoComKey extends Produto {
  key: string;
  id: number; // Ensure consistency
}

// Entradas de Produtos
export interface EntradaProduto {
  id: string; // Ou number, dependendo da sua API
  produtoId: number;
  produtoNome?: string; // Para exibição
  fornecedorId: string; // ADDED: ID do fornecedor para esta entrada
  fornecedorNome?: string; // ADDED: Para exibição
  quantidade: number;
  dataEntrada: string; // ISO Date string
  precoCusto?: number; // Opcional, se quiser rastrear o custo na entrada
  observacao?: string;
}

export type EntradaProdutoFormData = Omit<EntradaProduto, 'id' | 'produtoNome' | 'fornecedorNome'>;

export interface EntradaProdutoComKey extends EntradaProduto {
  key: string;
}

// Saídas de Produtos
export interface SaidaProduto {
  id: string; // Ou number, dependendo da sua API
  produtoId: number;
  produtoNome?: string; // Para exibição
  quantidade: number;
  dataSaida: string; // ISO Date string
  motivo?: string; // Ex: Venda, Perda, Ajuste
  cliente?: string; // Opcional, para quem foi a saída
  observacao?: string;
}

export type SaidaProdutoFormData = Omit<SaidaProduto, 'id' | 'produtoNome'>;

export interface SaidaProdutoComKey extends SaidaProduto {
  key: string;
}
