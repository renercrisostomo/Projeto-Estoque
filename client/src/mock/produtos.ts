import { Produto } from '@/types/entities';

// Interface para o mock, incluindo o campo 'ativo' para soft delete
export interface MockProduto extends Produto {
  ativo: boolean;
  // Adicionando campos que estavam no mock anterior e podem ser úteis, mas opcionais na entidade base
  categoria?: string;
  dataEntrada?: string;
  dataValidade?: string;
  lote?: string;
  codigoBarras?: string;
  imagemUrl?: string;
}

// eslint-disable-next-line prefer-const
export let mockProdutos: MockProduto[] = [
  {
    id: '1',
    nome: 'Laptop UltraPower',
    descricao: 'Laptop de última geração com 16GB RAM e SSD 512GB',
    preco: 7500.00,
    quantidadeEstoque: 15,
    unidadeMedida: 'un',
    fornecedorId: '1',
    fornecedorNome: 'Tech Distribuidora',
    categoria: 'Eletrônicos',
    dataEntrada: new Date(Date.UTC(2025, 0, 15)).toISOString(), // Janeiro 15, 2025
    dataValidade: new Date(Date.UTC(2027, 0, 15)).toISOString(),
    lote: 'LOTE202501A',
    codigoBarras: '7890000000011',
    imagemUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=Laptop',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Mouse Sem Fio Ergonômico',
    descricao: 'Mouse óptico sem fio com design ergonômico',
    preco: 120.50,
    quantidadeEstoque: 50,
    unidadeMedida: 'un',
    fornecedorId: '1',
    fornecedorNome: 'Tech Distribuidora',
    categoria: 'Acessórios de Informática',
    dataEntrada: new Date(Date.UTC(2025, 1, 20)).toISOString(), // Fevereiro 20, 2025
    imagemUrl: 'https://via.placeholder.com/150/00FF00/000000?Text=Mouse',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Teclado Mecânico Gamer RGB',
    descricao: 'Teclado mecânico com switches blue e iluminação RGB',
    preco: 350.00,
    quantidadeEstoque: 0, // Exemplo de produto sem estoque
    unidadeMedida: 'un',
    fornecedorId: '2',
    fornecedorNome: 'Periféricos Master',
    categoria: 'Acessórios Gamer',
    dataEntrada: new Date(Date.UTC(2024, 11, 10)).toISOString(), // Dezembro 10, 2024
    lote: 'LOTE202412G',
    codigoBarras: '7890000000035',
    ativo: false, // Exemplo de produto inativo
  },
  {
    id: '4',
    nome: 'Monitor LED 27 polegadas 4K',
    descricao: 'Monitor de alta resolução para trabalho e jogos',
    preco: 1800.00,
    quantidadeEstoque: 10,
    unidadeMedida: 'un',
    fornecedorId: '1',
    fornecedorNome: 'Tech Distribuidora',
    categoria: 'Monitores',
    dataEntrada: new Date(Date.UTC(2025, 2, 5)).toISOString(), // Março 5, 2025
    codigoBarras: '7890000000042',
    imagemUrl: 'https://via.placeholder.com/150/FF00FF/FFFFFF?Text=Monitor4K',
    ativo: true,
  },
];
