import { Table, Modal, Button, Input, Tag, Select, App } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import styles from '../../pages/proxy_seller/DelegationRequestManagement/DelegationRequestManagement.module.css';
import type { RequestDelegationItemProps } from '../../types/schema';
import { putData, patchData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { formatDate, formatPrice } from '../../utils/formatters';

const { TextArea } = Input;

interface ProxySellerDelegationItemProps {
  data: RequestDelegationItemProps[];
  getAll: () => Promise<void>;
  loading?: boolean;
}

const ProxySellerDelegationItem = ({ data, getAll, loading = false }: ProxySellerDelegationItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RequestDelegationItemProps | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSoldPriceModalOpen, setIsSoldPriceModalOpen] = useState(false);
  const [soldPrice, setSoldPrice] = useState('');
  const [soldRecord, setSoldRecord] = useState<RequestDelegationItemProps | null>(null);
  const pageSize = 10;
  const { message } = App.useApp();

  const showModal = (record: RequestDelegationItemProps) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRejectReason('');
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

  // Xử lý approve
  const handleApprove = async (id?: number) => {
    if (!id) return;
    setActionLoading(true);
    try {
      await putData<void>(`/api/delegation-requests/${id}/approve`, {});
      message.success('Chấp nhận yêu cầu thành công!');
      getAll();
      setIsModalOpen(false);
    } catch (error) {
      const errorData = error as ErrorResponse;
      message.error(errorData.message || 'Có lỗi xảy ra khi chấp nhận yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý reject
  const handleReject = async (id?: number, reason?: string) => {
    if (!id) return;
    if (!reason?.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    setActionLoading(true);
    try {
      await putData<void>(`/api/delegation-requests/${id}/reject`, { reason });
      message.success('Từ chối yêu cầu thành công!');
      getAll();
      setIsModalOpen(false);
      setRejectReason('');
    } catch (error) {
      const errorData = error as ErrorResponse;
      message.error(errorData.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý thay đổi trạng thái từ dropdown
  const handleStatusSelect = async (value: string, record: RequestDelegationItemProps) => {
    // Nếu chọn SOLD, hiển thị modal nhập giá bán
    if (value === 'SOLD') {
      setSoldRecord(record);
      setIsSoldPriceModalOpen(true);
      return;
    }

    setUpdatingId(record.id);
    try {
      let endpoint = '';
      
      switch (value) {
        case 'PRODUCT_RECEIVED':
          endpoint = `/api/delegation-requests/${record.id}/product-received`;
          break;
        case 'SELLING':
          endpoint = `/api/delegation-requests/${record.id}/selling`;
          break;
        case 'PAYMENT_COMPLETED':
          endpoint = `/api/delegation-requests/${record.id}/payment-completed`;
          break;
        default:
          message.warning('Trạng thái không hợp lệ');
          setUpdatingId(null);
          return;
      }

      await patchData(endpoint);
      
      message.success(`Cập nhật trạng thái "${statusMap[value]?.label}" thành công`);
      await getAll();
    } catch (error) {
      const errorData = error as ErrorResponse;
      message.error(errorData.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  // Xử lý xác nhận đã bán với giá bán
  const handleConfirmSold = async () => {
    if (!soldRecord) return;
    
    const price = parseFloat(soldPrice);
    if (!soldPrice || isNaN(price) || price <= 0) {
      message.warning('Vui lòng nhập giá bán hợp lệ');
      return;
    }

    setActionLoading(true);
    try {
      await patchData(`/api/delegation-requests/${soldRecord.id}/sold`, {
        soldPrice: price
      });
      
      message.success('Cập nhật trạng thái "Đã bán" thành công');
      setIsSoldPriceModalOpen(false);
      setSoldPrice('');
      setSoldRecord(null);
      await getAll();
    } catch (error) {
      const errorData = error as ErrorResponse;
      message.error(errorData.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setActionLoading(false);
    }
  };

  // Table columns
  const columns: TableProps<RequestDelegationItemProps>['columns'] = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Người ủy thác',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (text: number[]) => formatDate(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => {
        const { label, color } = statusMap[status] || { label: status, color: "default" };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Chi tiết',
      key: 'detail',
      width: 100,
      render: (_text, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      render: (_text, record) => {
        // Chỉ hiển thị dropdown cho các status có thể update
        const validStatuses = ['PRODUCT_RECEIVED', 'SELLING', 'SOLD', 'PAYMENT_COMPLETED'];
        const currentValue = validStatuses.includes(record.status) ? record.status : undefined;
        
        return (
          <Select
            value={currentValue}
            options={[
              { value: 'PRODUCT_RECEIVED', label: 'Đã nhận hàng' },
              { value: 'SELLING', label: 'Đang bán' },
              { value: 'SOLD', label: 'Đã bán' },
              { value: 'PAYMENT_COMPLETED', label: 'Đã thanh toán' },
            ]}
            onChange={(value) => handleStatusSelect(value, record)}
            style={{ width: '125px' }}
            placeholder="Chọn hành động"
            loading={updatingId === record.id}
            disabled={updatingId === record.id}
          />
        );
      },
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
              <h3>Thông tin người ủy thác</h3>
              <div style={{ display: 'flex', gap: '40px' }}>
                <p><strong>Tên:</strong> {selectedRecord.customerName}</p>
                <p><strong>ID:</strong> {selectedRecord.customerId}</p>
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

            {selectedRecord.status === 'PENDING' && (
              <div>
                <div className={styles.modalSection}>
                  <h3>Lý do từ chối</h3>
                  <TextArea
                    rows={4}
                    placeholder="Nhập lý do từ chối (nếu có)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 10 }}>
                  <Button 
                    danger
                    onClick={() => handleReject(selectedRecord.id, rejectReason)}
                    loading={actionLoading}
                  >
                    Từ chối
                  </Button>
                  <Button 
                    type="primary"
                    onClick={() => handleApprove(selectedRecord.id)}
                    loading={actionLoading}
                  >
                    Chấp nhận
                  </Button>
                </div>
              </div>
            )}

            {selectedRecord.status === 'REJECTED' && selectedRecord.rejectionReason && (
              <div className={styles.modalSection}>
                <h3>Lý do đã từ chối</h3>
                <p style={{ color: '#ff4d4f', fontSize: '15px' }}>
                  {selectedRecord.rejectionReason}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Sold Price Modal */}
      <Modal
        title="Nhập giá đã bán"
        open={isSoldPriceModalOpen}
        onCancel={() => {
          setIsSoldPriceModalOpen(false);
          setSoldPrice('');
          setSoldRecord(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsSoldPriceModalOpen(false);
              setSoldPrice('');
              setSoldRecord(null);
            }}
          >
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleConfirmSold}
            loading={actionLoading}
          >
            Xác nhận
          </Button>
        ]}
      >
        <Input
          type="number"
          placeholder="Nhập giá bán thực tế"
          value={soldPrice}
          onChange={(e) => setSoldPrice(e.target.value)}
          style={{ marginTop: 16 }}
          min={0}
          addonAfter="VNĐ"
        />
      </Modal>
    </>
  );
};

export default ProxySellerDelegationItem;
