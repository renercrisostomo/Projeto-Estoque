"use client";

import React, { useContext, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, notification } from 'antd'; // Changed message to notification
import Link from 'next/link';
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';

const { Title } = Typography;

interface SignInData {
  email: string;
  password: string;
  remember?: boolean;
}

export default function LoginPage({}) {
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignInData) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      await signIn(values);
      // Navigation will be handled by AuthContext upon successful signIn
    } catch (error) {
      console.error('Falha no login:', error);
      let errorMsg = 'Erro ao tentar fazer login. Tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      notification.error({ // Changed message.error to notification.error
        message: 'Falha no Login',
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
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
          name="email"
          rules={[{ required: true, message: 'Por favor, insira seu e-mail!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-mail" type="email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Senha" />
        </Form.Item>
        {/* <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Lembrar-me</Checkbox>
            </Form.Item> 
            <Link href="/auth/forgot-password">Esqueceu a senha?</Link>
          </div>
        </Form.Item> */}

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}> {/* Added loading prop to Button */}
            Entrar
          </Button>
          ou <Link href="/auth/register">Cadastre-se agora!</Link>
        </Form.Item>
      </Form>
    </>
  );
}