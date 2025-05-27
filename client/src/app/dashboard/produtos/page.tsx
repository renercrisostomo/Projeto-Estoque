// src/app/dashboard/produtos/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Input, Select, Space, message, InputNumber } from 'antd'; 
import axios from 'axios';
import { ProdutoFormData, ProdutoComKey } from '@/types/entities'; 
import { produtoService } from '@/services/produtoService';

// Import generic components
import { DashboardPageHeader } from '../components/DashboardPageHeader';
import { DashboardTable } from '../components/DashboardTable';
import { DashboardForm } from '../components/DashboardForm';
import { getProdutosTableColumns } from './components/ProdutosTableColumns';

const { Option } = Select;

const unidadesDeMedida = [
  { value: 'un', label: 'Unidade (un)' },
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'mL', label: 'Mililitro (mL)' },
  { value: 'm', label: 'Metro (m)' },
  { value: 'cm', label: 'Centímetro (cm)' },
  { value: 'caixa', label: 'Caixa (cx)' },
  { value: 'pacote', label: 'Pacote (pct)' },
];

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoComKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<ProdutoComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage(); 
  
  const [form] = Form.useForm<ProdutoFormData>();

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await produtoService.listarProdutos();
      const dataToMap = Array.isArray(response) ? response : [];
      const produtosComKey = dataToMap.map(p => ({
        ...p,
        key: String(p.id),
      }));
      setProdutos(produtosComKey);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      messageApi.error('Falha ao carregar produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchProdutos(); // Fetch products directly
  }, [fetchProdutos]);

  const handleAdd = useCallback(() => {
    setEditingProduto(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((record: ProdutoComKey) => {
    form.setFieldsValue(record); // record no longer has fornecedorId
    setEditingProduto(record);
    setIsModalOpen(true);
  }, [form]);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduto(null); 
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await produtoService.deletarProduto(String(id));
      messageApi.success('Produto excluído com sucesso!');
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      messageApi.error('Falha ao excluir produto. Tente novamente.');
    } 
  }, [fetchProdutos, messageApi]);

  const onFinishModal = useCallback(async (values: ProdutoFormData): Promise<void> => {
    setLoading(true);
    const payload: ProdutoFormData = {
      ...values,
      preco: Number(values.preco),
      quantidadeEstoque: Number(values.quantidadeEstoque),
    };

    try {
      if (editingProduto) {
        await produtoService.atualizarProduto(String(editingProduto.id), payload);
        messageApi.success('Produto atualizado com sucesso!');
      } else {
        await produtoService.criarProduto(payload);
        messageApi.success('Produto adicionado com sucesso!');
      }
      setIsModalOpen(false);
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      let errorMsg = 'Falha ao salvar produto. Verifique os dados e tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [editingProduto, fetchProdutos, messageApi]);

  const clearGlobalSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const tableColumns = useMemo(() => getProdutosTableColumns({
    handleEdit,
    handleDelete,
    clearGlobalSearch,
  }), [handleEdit, handleDelete, clearGlobalSearch]);

  const filteredProdutos = useMemo(() =>
    produtos.filter(produto =>
      Object.values(produto).some(value =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    ), [produtos, searchText]);

  const produtoFormItems = (
    <>
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
      <Space wrap style={{ width: '100%' }} align="baseline">
        <Form.Item
          name="preco"
          label="Preço (R$)"
          rules={[{ required: true, message: 'Por favor, insira o preço!' }, { type: 'number', min: 0, message: 'O preço deve ser um número positivo!'}] }
          getValueFromEvent={(event) => {
            const value = event.target.value;
            // Remove non-numeric characters except comma and period for initial input flexibility
            const numericValue = value.replace(/[^0-9.,]/g, '');
            // Replace comma with period for consistency before parsing
            return numericValue.replace(',', '.');
          }}
          getValueProps={(value) => ({
            value: typeof value === 'number' ? String(value).replace('.', ',') : value,
          })}
        >
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} precision={2} decimalSeparator="," />
        </Form.Item>
        <Form.Item
          name="quantidadeEstoque"
          label="Quantidade em Estoque"
          rules={[{ required: true, message: 'Por favor, insira a quantidade!' }, { type: 'number', min: 0, message: 'A quantidade deve ser um número positivo!'}]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="unidadeMedida" label="Unidade de Medida" initialValue="un">
          <Select style={{ width: 120 }}>
            {unidadesDeMedida.map(unidade => (
              <Option key={unidade.value} value={unidade.value}>{unidade.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Space>
    </>
  );

  return (
    <div>
      {contextHolder} {/* Added contextHolder */}
      <DashboardPageHeader
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onAddButtonClick={handleAdd}
        addButtonText="Adicionar Produto"
        searchPlaceholder="Buscar em todos os campos..."
        addButtonLoading={loading && !isModalOpen}
      />

      <DashboardTable<ProdutoComKey>
        columns={tableColumns}
        dataSource={filteredProdutos}
        loading={loading}
        rowKey="id"
        bordered
      />

      <DashboardForm<ProdutoFormData, ProdutoComKey | null>
        open={isModalOpen}
        onCancel={handleModalCancel}
        onFinish={onFinishModal}
        editingEntity={editingProduto}
        form={form}
        loading={loading && isModalOpen}
        modalTitle={(editing) => editing ? 'Editar Produto' : 'Adicionar Novo Produto'}
        formItems={produtoFormItems}
        submitButtonText={(editing) => editing ? 'Salvar Alterações' : 'Adicionar Produto'}
      />
    </div>
  );
}