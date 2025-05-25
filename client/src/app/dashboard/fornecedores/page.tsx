// src/app/dashboard/fornecedores/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps, FormProps } from 'antd';
import { Fornecedor, FornecedorFormData } from '@/types/entities';
import { fornecedorService } from '@/services/fornecedorService'; // Importar o serviço
import axios from 'axios'; // Added import for axios type guard

type FornecedorComKey = Fornecedor & { key: string };

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<FornecedorComKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<FornecedorComKey | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento
  
  const [form] = Form.useForm<FornecedorFormData>();

  const fetchFornecedores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fornecedorService.listarFornecedores();
      setFornecedores(data.map(f => ({ ...f, key: String(f.id), id: String(f.id) })));
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      message.error('Falha ao carregar fornecedores. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handleAdd = () => {
    setEditingFornecedor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: FornecedorComKey) => {
    setEditingFornecedor(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await fornecedorService.deletarFornecedor(id);
      message.success('Fornecedor excluído com sucesso!');
      fetchFornecedores(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      message.error('Falha ao excluir fornecedor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onFinish: FormProps<FornecedorFormData>['onFinish'] = async (values) => {
    setLoading(true);
    const payload: FornecedorFormData = {
        ...values,
    };

    try {
      if (editingFornecedor) {
        await fornecedorService.atualizarFornecedor(String(editingFornecedor.id), payload);
        message.success('Fornecedor atualizado com sucesso!');
      } else {
        await fornecedorService.criarFornecedor(payload);
        message.success('Fornecedor adicionado com sucesso!');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchFornecedores(); // Atualiza a lista
    } catch (error) { // Changed from error: any
      console.error("Erro ao salvar fornecedor:", error);
      // Type guard for AxiosError
      let errorMsg = 'Falha ao salvar fornecedor. Verifique os dados e tente novamente.';
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

  const columns: TableProps<FornecedorComKey>['columns'] = [
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
            <Button onClick={() => { if (clearFilters) { clearFilters(); setSearchText(''); } confirm();}} size="small" style={{ width: 90 }}>
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
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Excluir fornecedor"
            description="Tem certeza que deseja excluir este fornecedor?"
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
  
  const filteredFornecedores = fornecedores.filter(f =>
    Object.values(f).some(value => 
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
          Adicionar Fornecedor
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredFornecedores} 
        rowKey="id" 
        bordered 
        loading={loading} // Adicionado estado de carregamento à tabela
      />

      <Modal
        title={editingFornecedor ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}
        open={isModalOpen}
        onCancel={() => {setIsModalOpen(false); form.resetFields();}}
        footer={null}
        destroyOnClose
      >
        <Form<FornecedorFormData> form={form} layout="vertical" onFinish={onFinish} style={{marginTop: '20px'}}>
          <Form.Item
            name="nome"
            label="Nome do Fornecedor"
            rules={[{ required: true, message: 'Por favor, insira o nome do fornecedor!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="contatoNome" label="Nome do Contato">
            <Input />
          </Form.Item>
          <Form.Item name="contatoEmail" label="Email do Contato" rules={[{ type: 'email', message: 'Email inválido!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contatoTelefone" label="Telefone do Contato">
            <Input />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => {setIsModalOpen(false); form.resetFields();}}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingFornecedor ? 'Salvar Alterações' : 'Adicionar Fornecedor'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}