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
  rowKey = "id",
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
