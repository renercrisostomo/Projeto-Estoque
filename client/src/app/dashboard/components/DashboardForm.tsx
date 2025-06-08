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
  initialValues?: Partial<TFormData>; // Adicionada a propriedade initialValues
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
  initialValues,
}: DashboardFormProps<TFormData, TEntityComKey>) {
  const handleFormFinish: FormProps<TFormData>['onFinish'] = async (values) => {
    await onFinish(values);
  };

  // Effect to set form values when modal opens or editingEntity/initialValues change
  React.useEffect(() => {
    if (open) {
      if (editingEntity) {
        form.setFieldsValue(editingEntity as unknown as TFormData); // Use type assertion if types are compatible but TS can't infer
      } else if (initialValues) {
        form.setFieldsValue(initialValues as TFormData);
      } else {
        form.resetFields(); // Reset if no entity and no initial values for new form
      }
    } else {
      // Optionally reset fields when modal is not open if destroyOnClose is not sufficient
      // form.resetFields(); 
    }
  }, [open, editingEntity, initialValues, form]);

  return (
    <Modal
      title={modalTitle(editingEntity)}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      // forceRender // Pode não ser necessário se usar useEffect para setFieldsValue
    >
      <Form<TFormData>
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
        style={{ marginTop: '20px' }}
        // A propriedade initialValues no Form pode entrar em conflito com useEffect/setFieldsValue,
        // então gerencie o estado inicial via useEffect ou garanta uma única fonte da verdade.
        // Para simplicidade, se useEffect for usado, isso pode ser omitido ou definido como um padrão.
        // initialValues={initialValues || {}}
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
