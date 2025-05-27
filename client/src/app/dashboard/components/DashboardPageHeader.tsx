// c:\Rener-SSD\github\projeto-estoque\client\src\app\dashboard\components\DashboardPageHeader.tsx
import React from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface DashboardPageHeaderProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onAddButtonClick: () => void;
  addButtonText: string;
  searchPlaceholder?: string;
  addButtonLoading?: boolean;
}

export function DashboardPageHeader({
  searchText,
  onSearchTextChange,
  onAddButtonClick,
  addButtonText,
  searchPlaceholder = "Buscar...",
  addButtonLoading = false,
}: DashboardPageHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
  );
}
