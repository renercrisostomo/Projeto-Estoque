// src/app/dashboard/saidas/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, message, Input, Select, DatePicker, InputNumber } from 'antd';
import { SaidaProdutoFormData, SaidaProdutoComKey, Produto } from '@/types/entities';
import { saidaService } from '@/services/saidaService';
import { produtoService } from '@/services/produtoService';
import axios from 'axios';
import dayjs from 'dayjs';

import { DashboardPageHeader } from '../components/DashboardPageHeader';
import { DashboardTable } from '../components/DashboardTable';
import { DashboardForm } from '../components/DashboardForm';
import { getSaidasTableColumns } from './components/SaidasTableColumns';

const { Option } = Select;

export default function SaidasPage() {
  const [saidas, setSaidas] = useState<SaidaProdutoComKey[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaida, setEditingSaida] = useState<SaidaProdutoComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<SaidaProdutoFormData>();

  const fetchProdutos = useCallback(async () => {
    try {
      const response = await produtoService.listarProdutos();
      setProdutos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      messageApi.error('Falha ao carregar produtos para o formulário.');
    }
  }, [messageApi]);

  const fetchSaidas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await saidaService.listarSaidas();
      const dataToMap = Array.isArray(response) ? response : [];
      const saidasComProdutoNome = dataToMap.map(s => ({
        ...s,
        key: String(s.id),
        produtoNome: produtos.find(p => p.id === s.produtoId)?.nome || 'Produto não encontrado',
      }));
      setSaidas(saidasComProdutoNome);
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
      messageApi.error('Falha ao carregar registros de saída.');
    } finally {
      setLoading(false);
    }
  }, [messageApi, produtos]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  useEffect(() => {
    if (produtos.length > 0) {
      fetchSaidas();
    }
  }, [fetchSaidas, produtos]);

  const handleAdd = useCallback(() => {
    setEditingSaida(null);
    form.setFieldsValue({ dataSaida: dayjs().toISOString() }); // Default to today
    setIsModalOpen(true);
  }, [form]);

  const handleEdit = useCallback((record: SaidaProdutoComKey) => {
    setEditingSaida(record);
    form.setFieldsValue({
      ...record,
      dataSaida: dayjs(record.dataSaida).toISOString(),
    });
    setIsModalOpen(true);
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await saidaService.deletarSaida(id);
      messageApi.success('Registro de saída excluído com sucesso!');
      await fetchSaidas();
    } catch (error) {
      console.error("Erro ao excluir saída:", error);
      messageApi.error('Falha ao excluir registro de saída.');
    } finally {
      setLoading(false);
    }
  }, [fetchSaidas, messageApi]);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingSaida(null);
  }, []);

  const onFinishModal = useCallback(async (values: SaidaProdutoFormData): Promise<void> => {
    setLoading(true);
    const payload: SaidaProdutoFormData = {
      ...values,
      dataSaida: dayjs(values.dataSaida).toISOString(),
      quantidade: Number(values.quantidade),
    };

    try {
      if (editingSaida) {
        await saidaService.atualizarSaida(String(editingSaida.id), payload);
        messageApi.success('Registro de saída atualizado com sucesso!');
      } else {
        await saidaService.criarSaida(payload);
        messageApi.success('Registro de saída adicionado com sucesso!');
      }
      setIsModalOpen(false);
      await fetchSaidas();
    } catch (error) {
      console.error("Erro ao salvar saída:", error);
      let errorMsg = 'Falha ao salvar registro de saída.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [editingSaida, fetchSaidas, messageApi]);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const tableColumns = useMemo(() => getSaidasTableColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }), [handleEdit, handleDelete]);

  const filteredSaidas = useMemo(() =>
    saidas.filter(s =>
      Object.values(s).some(value =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    ),
    [saidas, searchText]
  );

  const saidaFormItems = useMemo(() => (
    <>
      <Form.Item
        name="produtoId"
        label="Produto"
        rules={[{ required: true, message: 'Por favor, selecione o produto!' }]}
      >
        <Select placeholder="Selecione um produto" showSearch filterOption={(input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())}>
          {produtos.map(p => <Option key={p.id} value={p.id}>{p.nome}</Option>)}
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
        name="dataSaida"
        label="Data da Saída"
        rules={[{ required: true, message: 'Por favor, selecione a data!' }]}
        getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="motivo" label="Motivo da Saída">
        <Input placeholder="Ex: Venda, Perda, Ajuste" />
      </Form.Item>
      <Form.Item name="cliente" label="Cliente/Destino">
        <Input placeholder="Opcional" />
      </Form.Item>
      <Form.Item name="observacao" label="Observação">
        <Input.TextArea rows={2} placeholder="Opcional" />
      </Form.Item>
    </>
  ), [produtos]);

  return (
    <div>
      {contextHolder}
      <DashboardPageHeader
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onAddButtonClick={handleAdd}
        addButtonText="Registrar Saída"
        searchPlaceholder="Buscar em todas as saídas..."
        addButtonLoading={loading && !isModalOpen}
      />
      <DashboardTable<SaidaProdutoComKey>
        columns={tableColumns}
        dataSource={filteredSaidas}
        loading={loading}
        rowKey="key"
        bordered
      />
      <DashboardForm<SaidaProdutoFormData, SaidaProdutoComKey | null>
        form={form}
        open={isModalOpen}
        onCancel={handleModalCancel}
        onFinish={onFinishModal}
        editingEntity={editingSaida}
        modalTitle={(entity) => entity ? "Editar Registro de Saída" : "Registrar Nova Saída"}
        formItems={saidaFormItems}
        loading={loading && isModalOpen}
        submitButtonText={(entity) => entity ? "Salvar Alterações" : "Registrar Saída"}
      />
    </div>
  );
}
