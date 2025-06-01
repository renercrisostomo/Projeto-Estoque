import { Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SaidaProdutoComKey } from '@/types/entities';
import { ColumnsType } from 'antd/es/table';

interface SaidasTableColumnsProps {
  onEdit: (record: SaidaProdutoComKey) => void;
  onDelete: (id: number) => void;
}

export const getSaidasTableColumns = ({
  onEdit,
  onDelete,
}: SaidasTableColumnsProps): ColumnsType<SaidaProdutoComKey> => [
  {
    title: 'Produto',
    dataIndex: 'produtoNome',
    key: 'produtoNome',
    sorter: (a, b) => a.produtoNome!.localeCompare(b.produtoNome!),
  },
  {
    title: 'Quantidade',
    dataIndex: 'quantidade',
    key: 'quantidade',
    sorter: (a, b) => a.quantidade - b.quantidade,
  },
  {
    title: 'Data da Saída',
    dataIndex: 'dataSaida',
    key: 'dataSaida',
    render: (text: string) => new Date(text).toLocaleDateString(),
    sorter: (a, b) => new Date(a.dataSaida).getTime() - new Date(b.dataSaida).getTime(),
  },
  {
    title: 'Motivo',
    dataIndex: 'motivo',
    key: 'motivo',
  },
  {
    title: 'Cliente',
    dataIndex: 'cliente',
    key: 'cliente',
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
