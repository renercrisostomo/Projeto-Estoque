"use client";

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PieChartOutlined,
  AppstoreOutlined,
  ShopOutlined,
  SolutionOutlined,
  LogoutOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,  
  FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { AuthContext } from '@/contexts/AuthContext';
import { TitleProvider, useTitle } from '@/contexts/TitleContext';

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

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useContext(AuthContext);
  const { title } = useTitle();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    signOut();
    
  };

  
  const menuItems: MenuItem[] = [
    getItem(<Link href="/dashboard">Dashboard</Link>, '/dashboard', <PieChartOutlined />),
    getItem('Cadastros', 'sub1', <AppstoreOutlined />, [
      getItem(<Link href="/dashboard/produtos">Produtos</Link>, '/dashboard/produtos', <ShopOutlined />),
      getItem(<Link href="/dashboard/fornecedores">Fornecedores</Link>, '/dashboard/fornecedores', <SolutionOutlined />),
      getItem(<Link href="/dashboard/entradas">Entradas</Link>, '/dashboard/entradas', <ArrowDownOutlined />),
      getItem(<Link href="/dashboard/saidas">Saídas</Link>, '/dashboard/saidas', <ArrowUpOutlined />),
    ]),
    getItem(<Link href="/dashboard/relatorios">Relatórios</Link>, '/dashboard/relatorios', <FileTextOutlined />),
    getItem('Sair', 'logout', <LogoutOutlined />, undefined), 
  ];


  
  const defaultOpenKeys = menuItems.reduce((acc, item) => { 
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
      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header style={{ padding: '0 16px', background: colorBgContainer, flexShrink: 0 }}>
          <span className="text-lg font-semibold">{title}</span> {/* Titulo dinamico conforme pagina */}
        </Header>
        <Content style={{ margin: '0 16px', overflowY: 'auto', flexGrow: 1 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {/* Gerar breadcrumbs dinamicamente com base no pathname */}
            <Breadcrumb.Item><Link href="/dashboard">Dashboard</Link></Breadcrumb.Item>
            {pathname.startsWith('/dashboard/produtos') && <Breadcrumb.Item><Link href="/dashboard/produtos">Produtos</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/fornecedores') && <Breadcrumb.Item><Link href="/dashboard/fornecedores">Fornecedores</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/entradas') && <Breadcrumb.Item><Link href="/dashboard/entradas">Entradas</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/saidas') && <Breadcrumb.Item><Link href="/dashboard/saidas">Saídas</Link></Breadcrumb.Item>}
            {pathname.startsWith('/dashboard/relatorios') && <Breadcrumb.Item><Link href="/dashboard/relatorios">Relatórios</Link></Breadcrumb.Item>}
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
        <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
          Gestock - Gestor de Estoque ©{new Date().getFullYear()} Por renercrisostomo
        </Footer>
      </Layout>
    </Layout>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TitleProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </TitleProvider>
  );
}
