// src/app/dashboard/produtos/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps, FormProps } from 'antd';
import { Produto, ProdutoFormData, Fornecedor } from '@/types/entities';
import { produtoService } from '@/services/produtoService';
import { fornecedorService } from '@/services/fornecedorService';
import axios from 'axios';

const { Option } = Select;

type ProdutoComKey = Produto & { key: string };

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoComKey[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<ProdutoComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [form] = Form.useForm<ProdutoFormData>();

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await produtoService.listarProdutos();
      const produtosComFornecedorNome = data.map(p => ({
        ...p,
        key: String(p.id),
        fornecedorNome: fornecedores.find(f => String(f.id) === String(p.fornecedorId))?.nome || p.fornecedorNome,
      }));
      setProdutos(produtosComFornecedorNome);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      message.error('Falha ao carregar produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [fornecedores]);

  const fetchFornecedores = useCallback(async () => {
    try {
      const data = await fornecedorService.listarFornecedores();
      setFornecedores(data.map(f => ({ ...f, id: String(f.id) })));
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      message.error('Falha ao carregar fornecedores. Verifique a conexão com o servidor.');
    }
  }, []);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  useEffect(() => {
    if (fornecedores.length > 0) {
      fetchProdutos();
    } else {
      fetchProdutos();
    }
  }, [fornecedores, fetchProdutos]);

  const handleAdd = () => {
    setEditingProduto(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: ProdutoComKey) => {
    setEditingProduto(record);
    form.setFieldsValue({
      ...record,
      preco: record.preco,
      quantidadeEstoque: record.quantidadeEstoque,
      fornecedorId: record.fornecedorId ? String(record.fornecedorId) : undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await produtoService.deletarProduto(String(id));
      message.success('Produto excluído com sucesso!');
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      message.error('Falha ao excluir produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onFinish: FormProps<ProdutoFormData>['onFinish'] = async (values) => {
    setLoading(true);

    const payload: ProdutoFormData = {
      ...values,
      preco: Number(values.preco),
      quantidadeEstoque: Number(values.quantidadeEstoque),
      fornecedorId: values.fornecedorId ? String(values.fornecedorId) : undefined,
    };

    try {
      if (editingProduto) {
        await produtoService.atualizarProduto(String(editingProduto.id), payload);
        message.success('Produto atualizado com sucesso!');
      } else {
        await produtoService.criarProduto(payload);
        message.success('Produto adicionado com sucesso!');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      // Type guard for AxiosError
      let errorMsg = 'Falha ao salvar produto. Verifique os dados e tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<ProdutoComKey>['columns'] = [
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
            <Button onClick={() => { if (clearFilters) { clearFilters(); setSearchText('');} confirm();}} size="small" style={{ width: 90 }}>
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
      title: 'Fornecedor', 
      dataIndex: 'fornecedorNome', 
      key: 'fornecedorNome',
      render: (text, record) => {
        const fornecedor = fornecedores.find(f => String(f.id) === String(record.fornecedorId));
        return fornecedor?.nome || record.fornecedorNome || <Tag>N/A</Tag>;
      },
      filters: fornecedores.map(f => ({ text: f.nome, value: String(f.id) })),
      onFilter: (value, record) => String(record.fornecedorId) === String(value),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Excluir produto"
            description="Tem certeza que deseja excluir este produto?"
            onConfirm={() => handleDelete(String(record.id))}
            okText="Sim"
            cancelText="Não"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredProdutos = produtos.filter(produto =>
    Object.values(produto).some(value =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          placeholder="Buscar em todos os campos..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} loading={loading}>
          Adicionar Produto
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredProdutos} 
        rowKey="id" 
        bordered 
        loading={loading}
      />

      <Modal
        title={editingProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}
        open={isModalOpen}
        onCancel={() => {setIsModalOpen(false); form.resetFields();}}
        footer={null} 
        destroyOnHidden 
      >
        <Form<ProdutoFormData> form={form} layout="vertical" onFinish={onFinish} style={{marginTop: '20px'}} initialValues={{ preco: 0, quantidadeEstoque: 0}}>
          <Form.Item
            name="nome"
            label="Nome do Produto"
            rules={[{ required: true, message: 'Por favor, insira o nome do produto!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="descricao" label="Descrição">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Space wrap style={{width: '100%'}} align="baseline">
            <Form.Item
              name="preco"
              label="Preço (R$)"
              rules={[{ required: true, message: 'Por favor, insira o preço!' }, { type: 'number', min: 0, message: 'Preço deve ser positivo'}]}
            >
              <InputNumber min={0} step={0.01} style={{ width: '100%' }} precision={2} decimalSeparator="," />
            </Form.Item>
            <Form.Item
              name="quantidadeEstoque"
              label="Quantidade em Estoque"
              rules={[{ required: true, message: 'Por favor, insira a quantidade!' }, { type: 'number', min: 0, message: 'Quantidade deve ser positiva' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="unidadeMedida"
              label="Unidade de Medida"
              rules={[{ required: true, message: 'Por favor, selecione a unidade!' }]}
            >
              <Select placeholder="Selecione">
                <Option value="un">Unidade (un)</Option>
                <Option value="kg">Quilograma (kg)</Option>
                <Option value="g">Grama (g)</Option>
                <Option value="L">Litro (L)</Option>
                <Option value="mL">Mililitro (mL)</Option>
                <Option value="m">Metro (m)</Option>
                <Option value="cm">Centímetro (cm)</Option>
                <Option value="caixa">Caixa (cx)</Option>
                <Option value="pacote">Pacote (pct)</Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="fornecedorId" label="Fornecedor">
            <Select placeholder="Selecione um fornecedor (opcional)" allowClear>
              {fornecedores.map(f => (
                <Option key={String(f.id)} value={String(f.id)}>{f.nome}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => {setIsModalOpen(false); form.resetFields();}}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingProduto ? 'Salvar Alterações' : 'Adicionar Produto'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}