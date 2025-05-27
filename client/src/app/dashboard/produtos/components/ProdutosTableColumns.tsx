import React from 'react';
import { Button, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Produto } from '@/types/entities';

type ProdutoComKey = Produto & { key: string };

interface GetColumnsProps {
  handleEdit: (record: ProdutoComKey) => void;
  handleDelete: (id: number) => void;
  clearGlobalSearch: () => void; // To clear the main search input from column filter
}

export const getProdutosTableColumns = ({
  handleEdit,
  handleDelete,
  clearGlobalSearch,
}: GetColumnsProps): TableProps<ProdutoComKey>['columns'] => [
  {
    title: 'Nome',
    dataIndex: 'nome',
    key: 'nome',
    sorter: (a, b) => a.nome.localeCompare(b.nome),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder="Buscar nome"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button 
            onClick={() => {
              if (clearFilters) {
                clearFilters();
              }
              clearGlobalSearch(); // Also clear global search if desired, or remove this line
              confirm();
            }} 
            size="small" 
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record.nome.toLowerCase().includes((value as string).toLowerCase()),
  },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  {
    title: 'Preço (R$)',
    dataIndex: 'preco',
    key: 'preco',
    render: (preco: number) => typeof preco === 'number' ? preco.toFixed(2) : 'N/A',
    sorter: (a, b) => a.preco - b.preco,
  },
  {
    title: 'Estoque',
    dataIndex: 'quantidadeEstoque',
    key: 'quantidadeEstoque',
    sorter: (a, b) => a.quantidadeEstoque - b.quantidadeEstoque,
  },
  { title: 'Unidade', dataIndex: 'unidadeMedida', key: 'unidadeMedida' },
  {
    title: 'Ações',
    key: 'actions',
    render: (_, record) => (
      <Space size="middle">
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Tem certeza que deseja excluir este produto?"
          onConfirm={() => handleDelete(record.id)} // Removed 'as number' cast
          okText="Sim"
          cancelText="Não"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];
