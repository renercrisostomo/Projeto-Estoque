// client/src/app/dashboard/fornecedores/components/FornecedoresTableColumns.tsx
import React from 'react';
import { Button, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { FornecedorComKey } from '@/types/entities';

interface FornecedoresTableColumnsProps {
  onEdit: (record: FornecedorComKey) => void;
  onDelete: (id: string) => void;
}

export const getFornecedoresTableColumns = ({ 
  onEdit, 
  onDelete,
}: FornecedoresTableColumnsProps): TableProps<FornecedorComKey>['columns'] => [
  {
    title: 'Nome do Fornecedor',
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
                // setSearchText(''); // Removed: This was trying to access setSearchText from parent scope
              } 
              confirm(); // Confirm to apply the cleared filter state
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
  { title: 'Nome do Contato', dataIndex: 'contatoNome', key: 'contatoNome' },
  { title: 'Email do Contato', dataIndex: 'contatoEmail', key: 'contatoEmail' },
  { title: 'Telefone do Contato', dataIndex: 'contatoTelefone', key: 'contatoTelefone' },
  {
    title: 'Ações',
    key: 'actions',
    render: (_, record) => (
      <Space size="middle">
        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
        <Popconfirm
          title="Excluir fornecedor"
          description="Tem certeza que deseja excluir este fornecedor?"
          onConfirm={() => onDelete(String(record.id))}
          okText="Sim"
          cancelText="Não"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];
