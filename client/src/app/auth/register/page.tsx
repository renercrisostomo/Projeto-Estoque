"use client";

import React, { useContext, useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import Link from 'next/link';
import { AuthContext } from '../../../contexts/AuthContext';
import { RegisterRequest } from '../../../services/auth';

const { Title } = Typography;

export default function RegisterPage() {
  const { signUp } = useContext(AuthContext);
  const [form] = Form.useForm<RegisterRequest>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    await signUp(values);
    setLoading(false);
  };

  return (
      <>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
          Cadastre-se
        </Title>
        <Form<RegisterRequest>
          form={form}
          name="register"
          layout="vertical"
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira seu nome completo!', whitespace: true }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nome Completo" />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: 'Por favor, insira seu E-mail!' },
              { type: 'email', message: 'O formato do E-mail é inválido!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: 'Por favor, insira sua Senha!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Senha"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Por favor, confirme sua Senha!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As duas senhas não coincidem!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar Senha" />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Cadastrar
            </Button>
            Ou <Link href="/auth/login">Faça login agora!</Link>
          </Form.Item>
        </Form>
      </>
  );
}