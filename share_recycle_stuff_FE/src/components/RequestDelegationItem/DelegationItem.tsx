import { Table, Modal, Button, Tag, App } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import styles from '../../pages/customer/DelegationRequest/ViewDelegationRequest.module.css';
import type { RequestDelegationItemProps } from '../../types/schema';
import type { ErrorResponse } from '../../api/api';
import { patchData } from '../../api/api';
import { formatDate, formatPrice } from '../../utils/formatters';

interface DelegationItemProps {
  data: RequestDelegationItemProps[];
  getAll: () => Promise<void>;
  loading?: boolean;
}

const DelegationItem = ({ data, getAll, loading = false }: DelegationItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RequestDelegationItemProps | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { message } = App.useApp();

  const showModal = (record: RequestDelegationItemProps) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Mapping trạng thái
  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Đang chờ", color: "gold" },
    APPROVED: { label: "Đã chấp nhận", color: "green" },
    REJECTED: { label: "Đã từ chối", color: "red" },
    PRODUCT_RECEIVED: { label: "Đã nhận hàng", color: "blue" },
    SELLING: { label: "Đang bán", color: "cyan" },
    SOLD: { label: "Đã bán", color: "purple" },
    PAYMENT_COMPLETED: { label: "Đã thanh toán", color: "lime" },
  };

  const handleDelivery = async () => {
    if (!selectedRecord) return;
    
    setDeliveryLoading(true);
    try {
      await patchData(`/api/delegation-requests/${selectedRecord.id}/in-transit`);

      message.success('Cập nhật trạng thái "Đang giao" thành công');
      setIsModalOpen(false);
      await getAll();
    } catch (error) {
      const ErrorData = error as ErrorResponse;
      message.error(ErrorData.message || 'Có lỗi xảy ra khi xác nhận giao hàng');
    } finally {
      setDeliveryLoading(false);
    }
  };

  // Check if delivery button should be enabled (status === APPROVED)
  const canDeliver = selectedRecord?.status === 'APPROVED';

  // Table columns
  const columns: TableProps<RequestDelegationItemProps>['columns'] = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_text, _record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Người bán',
      dataIndex: 'proxySellerName',
      key: 'proxySellerName',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text: number[]) => formatDate(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const { label, color } = statusMap[status] || { label: status, color: "default" };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      render: (_text, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table<RequestDelegationItemProps>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ 
          position: ['bottomCenter'],
          pageSize: pageSize,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total: number) => `Tổng ${total} yêu cầu`
        }}
      />

      {/* Detail Modal */}
      <Modal
        title={<div className={styles.modalTitle}>Chi tiết yêu cầu ủy thác</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        width={700}
        footer={null}
      >
        {selectedRecord && (
          <div className={styles.modalContent}>
            <div className={styles.modalSection}>
              <h3>Thông tin người bán đại lý</h3>
              <div style={{ display: 'flex', gap: '40px' }}>
                <p><strong>Tên:</strong> {selectedRecord.proxySellerName}</p>
                <p><strong>ID:</strong> {selectedRecord.proxySellerId}</p>
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3>Thông tin sản phẩm</h3>
              <p><strong>Mô tả:</strong> {selectedRecord.productDescription}</p>
              <p><strong>Giá mong muốn:</strong> {formatPrice(selectedRecord.expectPrice)}</p>
            </div>

            <div className={styles.modalSection}>
              <h3>Thông tin ngân hàng</h3>
              <div style={{ display: 'flex', gap: '40px', marginBottom: '8px' }}>
                <p><strong>Ngân hàng:</strong> {selectedRecord.bankName}</p>
                <p><strong>Chủ tài khoản:</strong> {selectedRecord.accountHolderName}</p>
              </div>
              <p><strong>Số tài khoản:</strong> {selectedRecord.bankAccountNumber}</p>
            </div>

            <div className={styles.modalSection}>
              <h3>Hình ảnh sản phẩm</h3>
              <div className={styles.imageGrid}>
                {selectedRecord.imageUrls && selectedRecord.imageUrls.length > 0 ? (
                  selectedRecord.imageUrls.map((image: string, index: number) => (
                    <img 
                      key={index} 
                      className={styles.img} 
                      src={image} 
                      alt={`Product Image ${index + 1}`} 
                    />
                  ))
                ) : (
                  <p>Không có hình ảnh</p>
                )}
              </div>
            </div>

            {selectedRecord.status === 'REJECTED' && (
              <div className={styles.modalSection}>
                <h3>Lý do từ chối</h3>
                <p style={{ color: '#ff4d4f', fontSize: '15px' }}>
                  {selectedRecord.rejectionReason || 'Yêu cầu của bạn đã bị từ chối'}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 10 }}>
              <Button onClick={handleCancel}>
                Đóng
              </Button>
              <Button 
                type="primary"
                onClick={handleDelivery} 
                loading={deliveryLoading}
                disabled={!canDeliver}
              >
                Đã giao hàng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DelegationItem;
