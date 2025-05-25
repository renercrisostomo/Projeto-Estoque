"use client";

import React, { useContext, useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, notification } from 'antd'; // Changed message to notification
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/services/auth';
import axios from 'axios';

const { Title } = Typography;

export default function RegisterPage() {
  const { signUp } = useContext(AuthContext);
  const router = useRouter();
  const [form] = Form.useForm<RegisterRequest>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      await signUp(values);
      notification.success({ // Changed message.success to notification.success
        message: 'Cadastro Realizado',
        description: 'Cadastro realizado com sucesso! Você será redirecionado para o login.',
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Falha no cadastro:', error);
      let errorMsg = 'Erro ao realizar cadastro. Tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      notification.error({ // Changed message.error to notification.error
        message: 'Falha no Cadastro',
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Cadastre-se
      </Title>
      <Form<RegisterRequest>
        form={form}
        name="register"
        layout="vertical" // Added layout="vertical"
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Por favor, insira seu nome completo!', whitespace: true }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nome Completo" />
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
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
        </Form.Item>
        <Form.Item
          name="confirmPassword" // Added name prop here
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
          <Button block type="primary" htmlType="submit" loading={loading}> {/* Added loading prop to Button */}
            Cadastrar
          </Button>
          Ou <Link href="/auth/login">Faça login agora!</Link>
        </Form.Item>
      </Form>
    </>
  );
}