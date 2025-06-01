"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Input, DatePicker, Select, message, Spin } from 'antd';
import dayjs from 'dayjs';
import { getSaidasTableColumns } from './components/SaidasTableColumns';
import { saidaService } from '@/services/saidaService';
import { produtoService } from '@/services/produtoService';
import { Produto, SaidaProdutoComKey, SaidaProdutoFormData } from '@/types/entities';
import axios from 'axios';

import { DashboardPageHeader } from '../components/DashboardPageHeader';
import { DashboardTable } from '../components/DashboardTable';
import { DashboardForm } from '../components/DashboardForm';
import { useTitle } from '@/contexts/TitleContext';

const { Option } = Select;

interface SaidaFormSubmitValues {
  produtoId: number;
  quantidade: string;
  dataSaida: dayjs.Dayjs;
  observacao?: string;
}

export default function SaidasPage() {
  const [form] = Form.useForm<SaidaFormSubmitValues>();
  const [saidas, setSaidas] = useState<SaidaProdutoComKey[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaida, setEditingSaida] = useState<SaidaProdutoComKey | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { setTitle } = useTitle();
  // State for initial values passed to DashboardForm
  const [formInitialValues, setFormInitialValues] = useState<Partial<SaidaFormSubmitValues> | undefined>(undefined);

  useEffect(() => {
    setTitle('Gerenciar Saídas de Produtos');
  }, [setTitle]);

  const fetchSaidas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await saidaService.listarSaidas();
      const processedData = data.map(s => ({ 
        ...s, 
        key: String(s.id), 
        id: Number(s.id), 
        produtoId: Number(s.produtoId) 
      }));
      setSaidas(processedData);
    } catch (error) {
      console.error("Erro ao buscar registros de saída:", error);
      messageApi.error('Falha ao carregar os registros de saída.');
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  const fetchProdutos = useCallback(async () => {
    try {
      const data = await produtoService.listarProdutos();
      setProdutos(data.map(p => ({ ...p, id: Number(p.id) })));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      messageApi.error('Falha ao carregar os produtos para o formulário.');
    }
  }, [messageApi]);

  useEffect(() => {
    fetchProdutos();
    fetchSaidas();
  }, [fetchProdutos, fetchSaidas]);

  const handleAdd = useCallback(() => {
    setEditingSaida(null);
    setFormInitialValues({ // Set initial values for a new entry
      dataSaida: dayjs(), // Default to current date for new entries
      produtoId: undefined,
      quantidade: '',
      observacao: '',
    });
    setIsModalOpen(true);
  }, []); 

  const handleEdit = useCallback((record: SaidaProdutoComKey) => {
    setEditingSaida(record);

    const rawDataSaida = record.dataSaida;
    let dataSaidaAsDayjs: dayjs.Dayjs | null = null;

    if (rawDataSaida) {
      if (dayjs.isDayjs(rawDataSaida)) {
        dataSaidaAsDayjs = rawDataSaida;
      } else if (Array.isArray(rawDataSaida) && rawDataSaida.length === 3 && rawDataSaida.every(n => typeof n === 'number')) {
        const [year, month, day] = rawDataSaida as unknown as [number, number, number];
        dataSaidaAsDayjs = dayjs(new Date(year, month - 1, day));
      } else if (typeof rawDataSaida === 'string') {
        dataSaidaAsDayjs = dayjs(rawDataSaida);
      }

      if (dataSaidaAsDayjs && !dataSaidaAsDayjs.isValid()) {
        console.warn(`Data do registro (${JSON.stringify(rawDataSaida)}) é inválida ou não pôde ser interpretada. Usando null para o campo de data.`);
        dataSaidaAsDayjs = null;
      } else if (!dataSaidaAsDayjs && rawDataSaida) {
        console.warn(`Formato de data não reconhecido para (${JSON.stringify(rawDataSaida)}). Usando null para o campo de data.`);
        dataSaidaAsDayjs = null;
      }
    }

    setFormInitialValues({
      ...record,
      produtoId: Number(record.produtoId),
      quantidade: String(record.quantidade),
      dataSaida: dataSaidaAsDayjs === null ? undefined : dataSaidaAsDayjs, // Convert null to undefined
    });
    setIsModalOpen(true);
  }, []); 

  const handleDelete = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await saidaService.deletarSaida(id);
      messageApi.success('Registro de saída excluído com sucesso!');
      await fetchSaidas();
    } catch (error) {
      console.error("Erro ao excluir registro de saída:", error);
      let errorMsg = 'Falha ao excluir registro de saída.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchSaidas, messageApi]);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setEditingSaida(null);
    // form.resetFields(); // Handled by DashboardForm or its destroyOnClose
  }, []); 

  const onFinishModal = useCallback(async (values: SaidaFormSubmitValues) => {
    setFormSubmitting(true);
    const payload: SaidaProdutoFormData = {
      produtoId: Number(values.produtoId),
      quantidade: Number(values.quantidade),
      dataSaida: values.dataSaida.toISOString(),
      observacao: values.observacao,
    };

    try {
      if (editingSaida) {
        await saidaService.atualizarSaida(Number(editingSaida.id), payload);
        messageApi.success('Registro de saída atualizado com sucesso!');
      } else {
        await saidaService.criarSaida(payload);
        messageApi.success('Registro de saída adicionado com sucesso!');
      }
      setIsModalOpen(false);
      await fetchSaidas();
    } catch (error) {
      console.error("Erro ao salvar registro de saída:", error);
      let errorMsg = 'Falha ao salvar registro de saída.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      messageApi.error(errorMsg);
    } finally {
      setFormSubmitting(false);
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
    saidas.filter(s => {
      const produto = produtos.find(p => p.id === s.produtoId);
      const produtoNome = produto ? produto.nome : '';

      const rawDataSaidaItem = s.dataSaida;
      let itemDateAsDayjs: dayjs.Dayjs | null = null;

      if (rawDataSaidaItem) {
        if (dayjs.isDayjs(rawDataSaidaItem)) {
          itemDateAsDayjs = rawDataSaidaItem;
        } else if (Array.isArray(rawDataSaidaItem) && rawDataSaidaItem.length === 3 && rawDataSaidaItem.every(n => typeof n === 'number')) {
          const [year, month, day] = rawDataSaidaItem as unknown as [number, number, number];
          itemDateAsDayjs = dayjs(new Date(year, month - 1, day));
        } else if (typeof rawDataSaidaItem === 'string') {
          itemDateAsDayjs = dayjs(rawDataSaidaItem);
        }
      }
      
      const dataSaidaFormatada = itemDateAsDayjs && itemDateAsDayjs.isValid() 
        ? itemDateAsDayjs.format('DD/MM/YYYY') 
        : (rawDataSaidaItem ? 'Data Inválida' : 'N/A');
      
      return (
        produtoNome.toLowerCase().includes(searchText.toLowerCase()) ||
        String(s.quantidade).toLowerCase().includes(searchText.toLowerCase()) ||
        dataSaidaFormatada.includes(searchText.toLowerCase()) ||
        (s.observacao && s.observacao.toLowerCase().includes(searchText.toLowerCase()))
      );
    }),
    [saidas, produtos, searchText]
  );

  const saidaFormItems = useMemo(() => (
    <>
      <Form.Item
        name="produtoId"
        label="Produto"
        rules={[{ required: true, message: 'Por favor, selecione o produto!' }]}
      >
        <Select optionFilterProp="children" filterOption={(input, option) => (option?.children as unknown as string ?? '').toLowerCase().includes(input.toLowerCase())}>
          {produtos.map(produto => (
            <Option key={produto.id} value={produto.id}>{produto.nome}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="quantidade"
        label="Quantidade"
        rules={[
          { required: true, message: 'Por favor, insira a quantidade!' },
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || String(value).trim() === '') {
                return Promise.resolve();
              }
              const numValue = Number(value);
              if (isNaN(numValue)) {
                return Promise.reject(new Error('Quantidade deve ser um número!'));
              }
              if (numValue <= 0) {
                return Promise.reject(new Error('A quantidade deve ser maior que zero!'));
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Input type="number" min={1} />
      </Form.Item>
      <Form.Item
        name="dataSaida"
        label="Data da Saída"
        rules={[{ required: true, message: 'Por favor, selecione a data da saída!' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item
        name="observacao"
        label="Observação"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </>
  ), [produtos]);

  return (
    <Spin spinning={loading && saidas.length === 0 && produtos.length === 0 && !isModalOpen}>
      {contextHolder}
      <DashboardPageHeader
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        onAddButtonClick={handleAdd}
        addButtonText="Registrar Saída"
        searchPlaceholder="Buscar em saídas..."
        addButtonLoading={loading && !isModalOpen} 
      />
      <DashboardTable<SaidaProdutoComKey>
        columns={tableColumns}
        dataSource={filteredSaidas}
        loading={loading && !isModalOpen} 
        rowKey="key"
        bordered
      />
      <DashboardForm<SaidaFormSubmitValues, SaidaProdutoComKey | null>
        form={form}
        open={isModalOpen}
        onCancel={handleModalCancel}
        onFinish={onFinishModal}
        editingEntity={editingSaida} // Still used for UI logic (title, button text)
        modalTitle={(entity) => entity ? "Editar Saída de Produto" : "Registrar Nova Saída"}
        formItems={saidaFormItems}
        loading={formSubmitting}
        submitButtonText={(entity) => entity ? "Salvar Alterações" : "Registrar Saída"}
        // Pass the prepared and correctly typed initialValues
        initialValues={formInitialValues}
      />
    </Spin>
  );
}
