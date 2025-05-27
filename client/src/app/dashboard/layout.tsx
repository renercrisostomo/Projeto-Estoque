"use client";

import React, { useState, useContext } from 'react'; // Ensured useContext is imported
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShopOutlined,
  SolutionOutlined,
  LogoutOutlined,
  ArrowDownOutlined, // Added for Entradas
  ArrowUpOutlined,   // Added for Saidas
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd'; // Ensured Layout, Menu, Breadcrumb, theme are imported
import { AuthContext } from '@/contexts/AuthContext';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useContext(AuthContext); // Get signOut from context
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    signOut();
    // No need to redirect here, signOut in AuthContext should handle it
  };

  // Define menu items including the logout item
  const menuItems: MenuItem[] = [
    getItem(<Link href="/dashboard">Visão Geral</Link>, '/dashboard', <PieChartOutlined />),
    getItem('Cadastros', 'sub1', <AppstoreOutlined />, [
      getItem(<Link href="/dashboard/produtos">Produtos</Link>, '/dashboard/produtos', <ShopOutlined />),
      getItem(<Link href="/dashboard/fornecedores">Fornecedores</Link>, '/dashboard/fornecedores', <SolutionOutlined />),
      getItem(<Link href="/dashboard/entradas">Entradas</Link>, '/dashboard/entradas', <ArrowDownOutlined />),
      getItem(<Link href="/dashboard/saidas">Saídas</Link>, '/dashboard/saidas', <ArrowUpOutlined />),
    ]),
    getItem('Equipe', 'sub2', <TeamOutlined />, [
      getItem('Membro 1', '6', <UserOutlined />),
      getItem('Membro 2', '8', <UserOutlined />)
    ]),
    getItem('Arquivos', '9', <DesktopOutlined />),
    getItem('Sair', 'logout', <LogoutOutlined />, undefined), // Logout item
  ];


  // Determinar chaves abertas e selecionadas com base no pathname
  const defaultOpenKeys = menuItems.reduce((acc, item) => { // Changed items to menuItems
    if (item && 'children' in item && item.children) {
      const childHasActivePath = item.children.some(child => child && child.key === pathname);
      if (childHasActivePath && item.key) {
        acc.push(item.key.toString());
      }
    }
    return acc;
  }, [] as string[]);

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      handleLogout();
    }
    // For other menu items, navigation is handled by Link components
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical flex items-center justify-center my-4">
          <Link href="/dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/estoque-logo.png" 
              alt="Logo" 
              style={{ height: collapsed ? 28 : 32, transition: 'height 0.3s' }} 
            />
          </Link>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[pathname]} defaultOpenKeys={defaultOpenKeys} mode="inline" items={menuItems} onClick={onMenuClick} /> 
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer }}>
          {/* Pode adicionar um cabeçalho aqui, como nome do usuário, notificações, etc. */}
          <span className="text-lg font-semibold">Gestor de Estoque</span>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {/* Gerar breadcrumbs dinamicamente com base no pathname */}
            <Breadcrumb.Item><Link href="/dashboard">Dashboard</Link></Breadcrumb.Item>
            {pathname.startsWith('/dashboard/produtos') && <Breadcrumb.Item><Link href="/dashboard/produtos">Produtos</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/fornecedores') && <Breadcrumb.Item><Link href="/dashboard/fornecedores">Fornecedores</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/entradas') && <Breadcrumb.Item><Link href="/dashboard/entradas">Entradas</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/saidas') && <Breadcrumb.Item><Link href="/dashboard/saidas">Saídas</Link></Breadcrumb.Item>}
            {/* Adicionar mais conforme necessário */}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Gestor de Estoque ©{new Date().getFullYear()} Criado com Ant Design e Next.js
        </Footer>
      </Layout>
    </Layout>
  );
}
