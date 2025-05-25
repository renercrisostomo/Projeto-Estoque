import { Fornecedor } from '@/types/entities';

// Interface para o mock, incluindo o campo 'ativo' para soft delete
export interface MockFornecedor extends Fornecedor {
  ativo: boolean;
  // Adicionando campos que estavam no mock anterior e podem ser úteis, mas opcionais na entidade base
  cnpj?: string; 
  endereco?: string;
  responsavel?: string; 
  categoriaProduto?: string;
  dataContratoInicio?: string;
  dataContratoFim?: string;
  condicoesPagamento?: string;
  observacoes?: string;
}

// eslint-disable-next-line prefer-const
export let mockFornecedores: MockFornecedor[] = [
  {
    id: '1',
    nome: 'Tech Distribuidora Global',
    contatoNome: 'Carlos Alberto Silva',
    contatoEmail: 'carlos.silva@techdistglobal.com',
    contatoTelefone: '(11) 99999-0001',
    cnpj: '11.222.333/0001-44',
    endereco: 'Rua Inovação, 123, São Paulo, SP',
    responsavel: 'Mariana Lima',
    categoriaProduto: 'Eletrônicos, Software',
    dataContratoInicio: new Date(Date.UTC(2023, 0, 1)).toISOString(), // Janeiro 1, 2023
    dataContratoFim: new Date(Date.UTC(2026, 0, 1)).toISOString(), // Janeiro 1, 2026
    condicoesPagamento: 'Net 30 dias',
    observacoes: 'Parceiro estratégico para componentes de alta tecnologia.',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Periféricos Master Ltda.',
    contatoNome: 'Ana Beatriz Pereira',
    contatoEmail: 'ana.pereira@perifericosmaster.com.br',
    contatoTelefone: '(21) 98888-0002',
    cnpj: '44.555.666/0001-77',
    endereco: 'Avenida Gamer, 456, Rio de Janeiro, RJ',
    responsavel: 'Ricardo Alves',
    categoriaProduto: 'Acessórios Gamer, Hardware',
    dataContratoInicio: new Date(Date.UTC(2022, 5, 15)).toISOString(), // Junho 15, 2022
    condicoesPagamento: 'Net 45 dias',
    observacoes: 'Fornecedor especializado em produtos para o público gamer.',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Importados Express (Contrato Encerrado)',
    contatoNome: 'João Carlos Costa',
    contatoEmail: 'joao.costa@importexpress.com',
    contatoTelefone: '(41) 97777-0003',
    cnpj: '77.888.999/0001-00',
    endereco: 'Rua das Nações, 789, Curitiba, PR',
    responsavel: 'Sofia Mendes',
    categoriaProduto: 'Diversos Importados',
    dataContratoInicio: new Date(Date.UTC(2021, 8, 10)).toISOString(), // Setembro 10, 2021
    dataContratoFim: new Date(Date.UTC(2024, 8, 9)).toISOString(), // Setembro 9, 2024
    condicoesPagamento: 'À vista',
    observacoes: 'Contrato finalizado. Não realizar novos pedidos.',
    ativo: false, // Exemplo de fornecedor inativo
  },
];
