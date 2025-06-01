"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, message, Input, Select, DatePicker, InputNumber } from 'antd';
import { EntradaProdutoFormData, EntradaProdutoComKey, Produto, Fornecedor } from '@/types/entities';
import { entradaService } from '@/services/entradaService';
import { produtoService } from '@/services/produtoService';
import { fornecedorService } from '@/services/fornecedorService';
import axios from 'axios';
import dayjs from 'dayjs';

import { DashboardPageHeader } from '../components/DashboardPageHeader';
import { DashboardTable } from '../components/DashboardTable';
import { DashboardForm } from '../components/DashboardForm';
import { getEntradasTableColumns } from './components/EntradasTableColumns';
import { useTitle } from '@/contexts/TitleContext';

const { Option } = Select;

export default function EntradasPage() {
  const [entradas, setEntradas] = useState<EntradaProdutoComKey[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntrada, setEditingEntrada] = useState<EntradaProdutoComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { setTitle } = useTitle();
  const [form] = Form.useForm<EntradaProdutoFormData>();

  useEffect(() => {
    setTitle('Gerenciar Entradas de Produtos');
  }, [setTitle]);

  const fetchProdutos = useCallback(async () => {
    try {
      const response = await produtoService.listarProdutos();
      setProdutos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      messageApi.error('Falha ao carregar produtos para o formulário.');
    }
  }, [messageApi]);

  const fetchFornecedores = useCallback(async () => {
    try {
      const response = await fornecedorService.listarFornecedores();
      setFornecedores(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      messageApi.error('Falha ao carregar fornecedores para o formulário.');
    }
  }, [messageApi]);

  const fetchEntradas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await entradaService.listarEntradas();
      const dataToMap = Array.isArray(response) ? response : [];
      const entradasComNomes = dataToMap.map(e => ({
        ...e,
        key: String(e.id),
        produtoNome: produtos.find(p => p.id === e.produtoId)?.nome || 'Produto não encontrado',
        fornecedorNome: fornecedores.find(f => f.id === e.fornecedorId)?.nome || 'Fornecedor não encontrado',
      }));
      setEntradas(entradasComNomes);
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
      messageApi.error('Falha ao carregar registros de entrada.');
    } finally {
      setLoading(false);
    }
  }, [messageApi, produtos, fornecedores]);

  useEffect(() => {
    fetchProdutos();
    fetchFornecedores();
  }, [fetchProdutos, fetchFornecedores]);

  useEffect(() => {
    if (produtos.length > 0 && fornecedores.length > 0) {
      fetchEntradas();
    }
  }, [fetchEntradas, produtos, fornecedores]);

  const handleAdd = useCallback(() => {
    setEditingEntrada(null);
    form.setFieldsValue({ dataEntrada: dayjs().toISOString() }); 
    setIsModalOpen(true);
  }, [form]);

  const handleEdit = useCallback((record: EntradaProdutoComKey) => {
    setEditingEntrada(record);
    form.setFieldsValue({
      ...record,
      dataEntrada: dayjs(record.dataEntrada).toISOString(),
      fornecedorId: record.fornecedorId, 
    });
    setIsModalOpen(true);
  }, [form]);

  const handleDelete = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await entradaService.deletarEntrada(id);
      messageApi.success('Registro de entrada excluído com sucesso!');
      await fetchEntradas();
    } catch (error) {
      console.error("Erro ao excluir entrada:", error);
      messageApi.error('Falha ao excluir registro de entrada.');
    } finally {
      setLoading(false);
    }
  }, [fetchEntradas, messageApi]);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingEntrada(null);
  }, []);

  const onFinishModal = useCallback(async (values: EntradaProdutoFormData): Promise<void> => {
    setLoading(true);
    const payload: EntradaProdutoFormData = {
      ...values,
      dataEntrada: dayjs(values.dataEntrada).toISOString(),
      quantidade: Number(values.quantidade),
      precoCusto: values.precoCusto ? Number(values.precoCusto) : undefined,
      // fornecedorId from 'values' should now be a number due to Select change
      fornecedorId: values.fornecedorId, 
    };

    try {
      if (editingEntrada) {
        await entradaService.atualizarEntrada(editingEntrada.id, payload);
        messageApi.success('Registro de entrada atualizado com sucesso!');
      } else {
        await entradaService.criarEntrada(payload);
        messageApi.success('Registro de entrada adicionado com sucesso!');
      }
      setIsModalOpen(false);
      await fetchEntradas();
    } catch (error) {
      console.error("Erro ao salvar entrada:", error);
      let errorMsg = 'Falha ao salvar registro de entrada.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [editingEntrada, fetchEntradas, messageApi]);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const tableColumns = useMemo(() => getEntradasTableColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }), [handleEdit, handleDelete]);

  const filteredEntradas = useMemo(() =>
    entradas.filter(e =>
      Object.values(e).some(value =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    ),
    [entradas, searchText]
  );

  const entradaFormItems = useMemo(() => (
    <>
      <Form.Item
        name="produtoId"
        label="Produto"
        rules={[{ required: true, message: 'Por favor, selecione o produto!' }]}
      >
        <Select placeholder="Selecione um produto" showSearch filterOption={(input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())}>
          {/* Assuming p.id is already a number as per Produto type */}
          {produtos.map(p => <Option key={p.id} value={p.id}>{p.nome}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        name="fornecedorId"
        label="Fornecedor"
        rules={[{ required: true, message: 'Por favor, selecione o fornecedor!' }]}
      >
        <Select placeholder="Selecione um fornecedor" showSearch filterOption={(input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())}>
          {/* Ensure f.id (number) is used as the value for the Option */}
          {fornecedores.map(f => <Option key={f.id} value={f.id}>{f.nome}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        name="quantidade"
        label="Quantidade"
        rules={[{ required: true, message: 'Por favor, insira a quantidade!' }, { type: 'number', min: 1, message: 'A quantidade deve ser maior que zero!'}]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="dataEntrada"
        label="Data da Entrada"
        rules={[{ required: true, message: 'Por favor, selecione a data!' }]}
        getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item
        name="precoCusto"
        label="Preço de Custo (Unitário)"
        rules={[{ type: 'number', min: 0, message: 'O preço deve ser um número positivo!'}]}
      >
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} precision={2} decimalSeparator="," placeholder="Opcional"/>
      </Form.Item>
      <Form.Item name="observacao" label="Observação">
        <Input.TextArea rows={2} placeholder="Opcional" />
      </Form.Item>
    </>
  ), [produtos, fornecedores]);

  return (
    <div>
      {contextHolder}
      <DashboardPageHeader
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onAddButtonClick={handleAdd}
        addButtonText="Registrar Entrada"
        searchPlaceholder="Buscar em entradas..."
        addButtonLoading={loading && !isModalOpen}
      />
      <DashboardTable<EntradaProdutoComKey>
        columns={tableColumns}
        dataSource={filteredEntradas}
        loading={loading}
        rowKey="key"
        bordered
      />
      <DashboardForm<EntradaProdutoFormData, EntradaProdutoComKey | null>
        form={form}
        open={isModalOpen}
        onCancel={handleModalCancel}
        onFinish={onFinishModal}
        editingEntity={editingEntrada}
        modalTitle={(entity) => entity ? "Editar Registro de Entrada" : "Registrar Nova Entrada"}
        formItems={entradaFormItems}
        loading={loading && isModalOpen}
        submitButtonText={(entity) => entity ? "Salvar Alterações" : "Registrar Entrada"}
      />
    </div>
  );
}
