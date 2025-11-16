import { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, App } from 'antd';
import type { TableProps } from 'antd';
import { getData, postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import { formatPrice } from '../../../utils/formatters';
import styles from './Payment.module.css';

interface MonthlyRevenueResponse {
  id: number;
  month: number;
  year: number;
  totalSalesAmount: number;
  totalCommission: number;
  adminCommissionAmount: number;
  paymentStatus: 'NOT_DUE' | 'PENDING' | 'PAID' | 'OVERDUE';
  paymentDueDate: number[];
}

interface PaymentUrlResponse {
  paymentUrl: string;
}

const Payment = () => {
  const [revenueData, setRevenueData] = useState<MonthlyRevenueResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const { message } = App.useApp();

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const res = await getData<{ result: MonthlyRevenueResponse[] }>('/api/proxy-seller/revenue/my-history');
      setRevenueData(res.result || []);
    } catch (error) {
      const err = error as ErrorResponse;
      message.error(err.message || 'Không thể tải dữ liệu hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateArray: number[]) => {
    if (!dateArray || dateArray.length < 3) return 'N/A';
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    NOT_DUE: { label: 'Chưa đến hạn', color: 'default' },
    PENDING: { label: 'Đang chờ', color: 'gold' },
    PAID: { label: 'Đã thanh toán', color: 'green' },
    OVERDUE: { label: 'Quá hạn', color: 'red' },
  };

  const handlePayment = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một hóa đơn để thanh toán');
      return;
    }

    try {
      setLoading(true);
      const res = await postData<{ result: PaymentUrlResponse }>(
        '/api/proxy-seller/revenue/create-payment',
        { monthlyRevenueIds: selectedRowKeys }
      );

      if (res.result?.paymentUrl) {
        window.open(res.result.paymentUrl, '_blank');
        message.success('Đã mở trang thanh toán VNPay trong tab mới');
      } else {
        message.error('Không nhận được URL thanh toán từ server');
      }
    } catch (error) {
      const err = error as ErrorResponse;
      message.error(err.message || 'Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      setLoading(false);
      setIsPaymentModalVisible(false);
    }
  };

  const handleSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  const getTotalAmount = () => {
    return revenueData
      .filter((record) => selectedRowKeys.includes(record.id))
      .reduce((sum, record) => sum + record.adminCommissionAmount, 0);
  };

  const columns: TableProps<MonthlyRevenueResponse>['columns'] = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Tháng',
      key: 'monthYear',
      width: 120,
      render: (_text, record) => `${record.month}/${record.year}`,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalSalesAmount',
      key: 'totalSalesAmount',
      width: 150,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'totalCommission',
      key: 'totalCommission',
      width: 150,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Phí Admin',
      dataIndex: 'adminCommissionAmount',
      key: 'adminCommissionAmount',
      width: 150,
      render: (value: number) => (
        <span style={{ color: '#ff4d4f', fontWeight: 500 }}>
          {formatPrice(value)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      render: (status: string) => {
        const { label, color } = statusMap[status] || { label: status, color: 'default' };
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record: MonthlyRevenueResponse) => ({
      disabled: record.paymentStatus !== 'OVERDUE' && record.paymentStatus !== 'PENDING',
    }),
    hideSelectAll: true,
  };

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.titleText}>Thanh toán phí hoa hồng</div>
        
        <div className={styles.controls}>
          <Button
            type="primary"
            onClick={() => setIsPaymentModalVisible(true)}
            disabled={selectedRowKeys.length === 0}
          >
            Thanh toán ({selectedRowKeys.length} hóa đơn)
          </Button>
        </div>

        <div className="container">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={revenueData}
            rowKey={(record) => record.id}
            loading={loading}
            pagination={{
              position: ['bottomCenter'],
              pageSize: 10,
              showTotal: (total: number) => `Tổng ${total} hóa đơn`,
            }}
            scroll={{ x: 800 }}
          />
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Modal
        title="Xác nhận thanh toán"
        open={isPaymentModalVisible}
        onOk={handlePayment}
        onCancel={() => setIsPaymentModalVisible(false)}
        confirmLoading={loading}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn đã chọn <strong>{selectedRowKeys.length}</strong> hóa đơn để thanh toán.</p>
        <p>Tổng số tiền cần thanh toán: <strong style={{ color: '#1890ff', fontSize: '18px' }}>{formatPrice(getTotalAmount())}</strong></p>
        <p style={{ marginTop: 16, color: '#595959' }}>
          Bạn sẽ được chuyển đến trang VNPay để hoàn tất thanh toán.
        </p>
      </Modal>
    </div>
  );
};

export default Payment;
