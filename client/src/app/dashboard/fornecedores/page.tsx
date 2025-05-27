// src/app/dashboard/fornecedores/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, message, Input } from 'antd'; // Added Input
import { FornecedorFormData, FornecedorComKey } from '@/types/entities';
import { fornecedorService } from '@/services/fornecedorService';
import axios from 'axios';

// Import generic components
import { DashboardPageHeader } from '../components/DashboardPageHeader';
import { DashboardTable } from '../components/DashboardTable'; // Import generic table
import { DashboardForm } from '../components/DashboardForm';   // Import generic form
import { getFornecedoresTableColumns } from './components/FornecedoresTableColumns';
// Removed specific component imports:
// import { FornecedoresTable } from './components/FornecedoresTable';
// import { FornecedorForm } from './components/FornecedorForm';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<FornecedorComKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<FornecedorComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage(); // Added
  
  const [form] = Form.useForm<FornecedorFormData>();

  const fetchFornecedores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fornecedorService.listarFornecedores();
      // Ensure response is an array before mapping
      const dataToMap = Array.isArray(response) ? response : [];
      setFornecedores(dataToMap.map(f => ({ ...f, key: String(f.id) })));
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      messageApi.error('Falha ao carregar fornecedores. Tente novamente.'); // Changed
    } finally {
      setLoading(false);
    }
  }, [messageApi]); // Added messageApi dependency

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
      messageApi.success('Fornecedor excluído com sucesso!'); // Changed
      await fetchFornecedores(); // Refetch after delete
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      messageApi.error('Falha ao excluir fornecedor. Tente novamente.'); // Changed
    } finally {
      setLoading(false);
    }
  }, [fetchFornecedores, messageApi]); // Added messageApi dependency
  
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
        messageApi.success('Fornecedor atualizado com sucesso!'); // Changed
      } else {
        await fornecedorService.criarFornecedor(payload);
        messageApi.success('Fornecedor adicionado com sucesso!'); // Changed
      }
      setIsModalOpen(false);
      await fetchFornecedores(); // Refetch after add/edit
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      let errorMsg = 'Falha ao salvar fornecedor. Verifique os dados e tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg); // Changed
    } finally {
      setLoading(false);
    }
  }, [editingFornecedor, fetchFornecedores, messageApi]); // Added messageApi dependency

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
      {contextHolder} {/* Added contextHolder */}
      <DashboardPageHeader
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onAddButtonClick={handleAdd}
        addButtonText="Adicionar Fornecedor"
        searchPlaceholder="Buscar em todos os campos..."
        addButtonLoading={loading && !isModalOpen} // Only show loading on add button if not already loading for modal
      />

      <DashboardTable<FornecedorComKey> // Use generic table
        columns={tableColumns}
        dataSource={filteredFornecedores}
        loading={loading}
        rowKey="key" // or "id" if key is not explicitly added to FornecedorComKey for this purpose
        bordered
      />

      <DashboardForm<FornecedorFormData, FornecedorComKey | null> // Use generic form with two type arguments
        form={form}
        open={isModalOpen}
        onCancel={handleModalCancel}
        onFinish={onFinishModal}
        editingEntity={editingFornecedor} // Pass editingFornecedor directly
        modalTitle={(entity) => entity ? "Editar Fornecedor" : "Adicionar Fornecedor"} // Pass functions for titles/text
        formItems={fornecedorFormItems}
        loading={loading && isModalOpen} 
        submitButtonText={(entity) => entity ? "Salvar Alterações" : "Adicionar Fornecedor"}
      />
    </div>
  );
}