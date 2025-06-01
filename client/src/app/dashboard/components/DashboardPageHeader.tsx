import React from 'react';
import { Button, Input, Typography } from 'antd'; // Added Typography
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography; // Added Title

interface DashboardPageHeaderProps {
  title?: string; // Added title prop
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onAddButtonClick: () => void;
  addButtonText: string;
  searchPlaceholder?: string;
  addButtonLoading?: boolean;
}

export function DashboardPageHeader({
  title, // Added title
  searchText,
  onSearchTextChange,
  onAddButtonClick,
  addButtonText,
  searchPlaceholder = "Buscar...",
  addButtonLoading = false,
}: DashboardPageHeaderProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {title && <Title level={2} style={{ marginBottom: 16 }}>{title}</Title>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => onSearchTextChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddButtonClick} 
          loading={addButtonLoading}
        >
          {addButtonText}
        </Button>
      </div>
    </div>
  );
}
