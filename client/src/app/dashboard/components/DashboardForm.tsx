// c:\Rener-SSD\github\projeto-estoque\client\src\app\dashboard\components\DashboardForm.tsx
import React from 'react';
import { Modal, Form, Space, Button, FormInstance } from 'antd';
import type { FormProps } from 'antd';

interface DashboardFormProps<TFormData extends object, TEntityComKey extends object | null> {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: TFormData) => Promise<void>;
  editingEntity: TEntityComKey;
  form: FormInstance<TFormData>;
  loading: boolean;
  modalTitle: (editingEntity: TEntityComKey) => string;
  formItems: React.ReactNode;
  submitButtonText: (editingEntity: TEntityComKey) => string;
}

export function DashboardForm<TFormData extends object, TEntityComKey extends object | null>({
  open,
  onCancel,
  onFinish,
  editingEntity,
  form,
  loading,
  modalTitle,
  formItems,
  submitButtonText,
}: DashboardFormProps<TFormData, TEntityComKey>) {
  const handleFormFinish: FormProps<TFormData>['onFinish'] = async (values) => {
    await onFinish(values);
  };

  return (
    <Modal
      title={modalTitle(editingEntity)}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose // Keep this to ensure form state is reset if not explicitly handled by parent
    >
      <Form<TFormData>
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
        style={{ marginTop: '20px' }}
        initialValues={editingEntity || {}}
      >
        {formItems}
        <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {submitButtonText(editingEntity)}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
