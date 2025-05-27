"use client";

import React, { useContext, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import Link from 'next/link';
import { AuthContext } from '../../../contexts/AuthContext';
import { LoginRequest } from '../../../services/auth';

const { Title } = Typography;

export default function LoginPage() {
  const { signIn } = useContext(AuthContext);
  const [form] = Form.useForm<LoginRequest>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    await signIn(values);
    setLoading(false);
  };

  return (
    <>
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        style={{ padding: 20, borderRadius: '2px' }}
      >
        <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Por favor, insira seu email!' }, { type: 'email', message: 'Email inválido!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-mail" type="email" />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Entrar
          </Button>
          ou <Link href="/auth/register">Cadastre-se agora!</Link>
        </Form.Item>
      </Form>
    </>
  );
}