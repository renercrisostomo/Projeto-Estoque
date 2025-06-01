import { Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EntradaProdutoComKey } from '@/types/entities';
import { ColumnsType } from 'antd/es/table';

interface EntradasTableColumnsProps {
  onEdit: (record: EntradaProdutoComKey) => void;
  onDelete: (id: number) => void; // Changed id type to number
}

export const getEntradasTableColumns = ({
  onEdit,
  onDelete,
}: EntradasTableColumnsProps): ColumnsType<EntradaProdutoComKey> => [
  {
    title: 'Produto',
    dataIndex: 'produtoNome',
    key: 'produtoNome',
    sorter: (a, b) => a.produtoNome!.localeCompare(b.produtoNome!),
  },
  {
    title: 'Fornecedor',
    dataIndex: 'fornecedorNome',
    key: 'fornecedorNome',
    sorter: (a, b) => (a.fornecedorNome || '').localeCompare(b.fornecedorNome || ''),
  },
  {
    title: 'Quantidade',
    dataIndex: 'quantidade',
    key: 'quantidade',
    sorter: (a, b) => a.quantidade - b.quantidade,
  },
  {
    title: 'Data da Entrada',
    dataIndex: 'dataEntrada',
    key: 'dataEntrada',
    render: (text: string) => new Date(text).toLocaleDateString(),
    sorter: (a, b) => new Date(a.dataEntrada).getTime() - new Date(b.dataEntrada).getTime(),
  },
  {
    title: 'Preço de Custo (Und.)',
    dataIndex: 'precoCusto',
    key: 'precoCusto',
    render: (value?: number) => value ? `R$ ${value.toFixed(2)}` : 'N/A',
    sorter: (a, b) => (a.precoCusto || 0) - (b.precoCusto || 0),
  },
  {
    title: 'Observação',
    dataIndex: 'observacao',
    key: 'observacao',
  },
  {
    title: 'Ações',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Editar">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
        </Tooltip>
        <Tooltip title="Excluir">
          <Button icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} danger />
        </Tooltip>
      </Space>
    ),
  },
];
