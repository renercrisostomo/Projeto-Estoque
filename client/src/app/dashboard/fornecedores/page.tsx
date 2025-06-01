"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, message, Input } from 'antd'; 
import { FornecedorFormData, FornecedorComKey } from '@/types/entities';
import { fornecedorService } from '@/services/fornecedorService';
import axios from 'axios';

import { DashboardPageHeader } from '../components/DashboardPageHeader';
import { DashboardTable } from '../components/DashboardTable'; 
import { DashboardForm } from '../components/DashboardForm';   
import { getFornecedoresTableColumns } from './components/FornecedoresTableColumns';
import { useTitle } from '@/contexts/TitleContext';


export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<FornecedorComKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<FornecedorComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage(); 
  const { setTitle } = useTitle();
  
  const [form] = Form.useForm<FornecedorFormData>();

  useEffect(() => {
    setTitle('Gerenciar Fornecedores');
  }, [setTitle]);

  const fetchFornecedores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fornecedorService.listarFornecedores();
      
      const dataToMap = Array.isArray(response) ? response : [];
      setFornecedores(dataToMap.map(f => ({ ...f, key: String(f.id) })));
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      messageApi.error('Falha ao carregar fornecedores. Tente novamente.'); 
    } finally {
      setLoading(false);
    }
  }, [messageApi]); 

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handleAdd = useCallback(() => {
    setEditingFornecedor(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((record: FornecedorComKey) => {
    setEditingFornecedor(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await fornecedorService.deletarFornecedor(id);
      messageApi.success('Fornecedor excluído com sucesso!'); 
      await fetchFornecedores(); 
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      messageApi.error('Falha ao excluir fornecedor. Tente novamente.'); 
    } finally {
      setLoading(false);
    }
  }, [fetchFornecedores, messageApi]); 
  
  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingFornecedor(null);
  }, []);

  const onFinishModal = useCallback(async (values: FornecedorFormData): Promise<void> => {
    setLoading(true);
    const payload: FornecedorFormData = { ...values };

    try {
      if (editingFornecedor) {
        await fornecedorService.atualizarFornecedor(String(editingFornecedor.id), payload);
        messageApi.success('Fornecedor atualizado com sucesso!'); 
      } else {
        await fornecedorService.criarFornecedor(payload);
        messageApi.success('Fornecedor adicionado com sucesso!'); 
      }
      setIsModalOpen(false);
      await fetchFornecedores(); 
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      let errorMsg = 'Falha ao salvar fornecedor. Verifique os dados e tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg); 
    } finally {
      setLoading(false);
    }
  }, [editingFornecedor, fetchFornecedores, messageApi]); 

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const tableColumns = useMemo(() => getFornecedoresTableColumns({ 
    onEdit: handleEdit, 
    onDelete: handleDelete,
  }), [handleEdit, handleDelete]);

  const filteredFornecedores = useMemo(() => 
    fornecedores.filter(f =>
      Object.values(f).some(value => 
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    ), [fornecedores, searchText]);

  const fornecedorFormItems = useMemo(() => (
    <>
      <Form.Item
        name="nome"
        label="Nome do Fornecedor"
        rules={[{ required: true, message: 'Por favor, insira o nome do fornecedor!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contatoNome"
        label="Nome do Contato"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contatoEmail"
        label="Email do Contato"
        rules={[{ type: 'email', message: 'Por favor, insira um email válido!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contatoTelefone"
        label="Telefone do Contato"
      >
        <Input />
      </Form.Item>
    </>
  ), []);

  return (
    <div>
      {contextHolder}
      <DashboardPageHeader
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onAddButtonClick={handleAdd}
        addButtonText="Adicionar Fornecedor"
        searchPlaceholder="Buscar em fornecedores..."
        addButtonLoading={loading && !isModalOpen} 
      />

      <DashboardTable<FornecedorComKey> 
        columns={tableColumns}
        dataSource={filteredFornecedores}
        loading={loading}
        rowKey="key" 
        bordered
      />

      <DashboardForm<FornecedorFormData, FornecedorComKey | null> 
        form={form}
        open={isModalOpen}
        onCancel={handleModalCancel}
        onFinish={onFinishModal}
        editingEntity={editingFornecedor} 
        modalTitle={(entity) => entity ? "Editar Fornecedor" : "Adicionar Fornecedor"} 
        formItems={fornecedorFormItems}
        loading={loading && isModalOpen} 
        submitButtonText={(entity) => entity ? "Salvar Alterações" : "Adicionar Fornecedor"}
      />
    </div>
  );
}