"use client";

import React from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

export default function RegisterPage({}) {

  const onFinish = (values: Record<string, unknown>) => {
    console.log('Valores recebidos do formulário: ', values);
  };

  return (
    <>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Registrar
      </Title>
      <Form
        name="register"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Por favor, insira seu Nome de Usuário!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nome de Usuário" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Por favor, insira seu E-mail!' },
            { type: 'email', message: 'O formato do E-mail é inválido!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-mail" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua Senha!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Senha" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Por favor, confirme sua Senha!' },
            ({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
              validator(_: unknown, value: string) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('As duas senhas não coincidem!'));
              },
            }),
          ]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Confirmar Senha" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Registrar
          </Button>
          Ou <Link href="/auth/login">Faça login agora!</Link>
        </Form.Item>
      </Form>
    </>
  );
}