// c:\Rener-SSD\github\projeto-estoque\client\src\app\dashboard\components\DashboardTable.tsx
import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DashboardTableProps<T extends object> {
  columns: TableProps<T>['columns'];
  dataSource: T[];
  loading: boolean;
  rowKey?: string | ((record: T) => string);
  bordered?: boolean;
}

export function DashboardTable<T extends object>({
  columns,
  dataSource,
  loading,
  rowKey = "id", // Defaulting to "id" as it's commonly used in your pages
  bordered = true,
}: DashboardTableProps<T>) {
  return (
    <Table<T>
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      bordered={bordered}
      loading={loading}
    />
  );
}
