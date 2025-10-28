import { useState } from 'react';
import { Table, Tag, Button } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { ProxySellerRevenueResponse } from '../../../types/schema';
import { PaymentStatusText, PaymentStatusColor } from '../../../types/enums';
import type { PaymentStatus } from '../../../types/enums';
import { useMessage } from '../../../context/MessageProvider';
import { postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';

interface RevenueItemProps {
  data: ProxySellerRevenueResponse[];
  getAll: () => void;
  loading?: boolean;
}

interface CreateNotificationRequest {
  accountId: number;
  title: string;
  content: string;
  notificationType: number;
  deliveryMethod?: number;
  relatedEntityType?: string;
  relatedEntityId?: number;
}

const RevenueItem = ({ data, loading }: RevenueItemProps) => {
  const { showMessage } = useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [remindLoading, setRemindLoading] = useState<number | null>(null);

  const handleRemind = async (record: ProxySellerRevenueResponse) => {
    setRemindLoading(record.proxySellerId);
    try {
      const request: CreateNotificationRequest = {
        accountId: record.proxySellerId,
        title: 'Nhắc nhở thanh toán',
        content: `Chào ${record.name}, bạn có khoản thanh toán doanh thu tháng ${record.month}/${record.year} với số tiền ${formatCurrency(record.discountProfitPayable)} cần được thanh toán. Vui lòng hoàn thành thanh toán sớm nhất có thể.`,
        notificationType: 14, // ADMIN_MESSAGE
        deliveryMethod: 1, // IN_APP
        relatedEntityType: 'REVENUE',
        relatedEntityId: record.proxySellerId
      };

      await postData('/api/notifications', request);
      
      showMessage({ 
        type: 'success', 
        message: `Đã gửi nhắc nhở thanh toán cho ${record.name}` 
      });
    } catch (error) {
      const errorData = error as ErrorResponse;
      console.error('Remind error:', errorData);
      showMessage({ 
        type: 'error', 
        message: errorData.message || 'Gửi nhắc nhở thất bại',
        code: errorData.status 
      });
    } finally {
      setRemindLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns: ColumnsType<ProxySellerRevenueResponse> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 70,
      render: (_: unknown, __: ProxySellerRevenueResponse, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 150,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discountProfitPayable',
      key: 'discountProfitPayable',
      width: 150,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      width: 120,
      render: (_: unknown, record: ProxySellerRevenueResponse) => 
        `${record.month}/${record.year}`,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      render: (status: string) => {
        const paymentStatus = status as PaymentStatus;
        return (
          <Tag color={PaymentStatusColor[paymentStatus]}>
            {PaymentStatusText[paymentStatus]}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: 120,
      render: (_: unknown, record: ProxySellerRevenueResponse) => (
        <Button 
          type="link" 
          onClick={() => handleRemind(record)}
          disabled={record.paymentStatus === 'PAID'}
          loading={remindLoading === record.proxySellerId}
        >
          Nhắc nhở
        </Button>
      ),
    },
  ];

  const onPaginationChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.name}
      loading={loading}
      pagination={{
        position: ['bottomCenter'],
        pageSize: 10,
        current: currentPage,
      }}
      onChange={onPaginationChange}
    />
  );
};

export default RevenueItem;
