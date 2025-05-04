"use client";

import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

export default function LoginPage({}) {

  const onFinish = (values: Record<string, unknown>) => {
    console.log('Valores recebidos do formulário: ', values);
  };

  return (
    <>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Login
      </Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Por favor, insira seu nome de usuário!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nome de usuário" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Senha" />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Lembrar-me</Checkbox>
            </Form.Item>
            <Link href="/auth/forgot-password">Esqueceu a senha?</Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Entrar
          </Button>
          ou <Link href="/auth/register">Cadastre-se agora!</Link>
        </Form.Item>
      </Form>
    </>
  );
}