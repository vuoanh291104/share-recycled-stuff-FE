import { useState } from 'react';
import { Modal, Button, App, Select, Input } from 'antd';
import styles from '../../pages/proxy_seller/DelegationRequestManagement/DelegationRequestManagement.module.css';
import type { RequestDelegationItemProps } from '../../types/schema';
import { RequestDelegationStatusText, RequestDelegationStatusColor, type RequestDelegationStatus } from '../../types/enums';
import { putData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { formatDate } from '../../utils/formatters';

const { TextArea } = Input;

interface ApiResponse<T> {
  code: number;
  message: string;
  path?: string;
  timestamp: string;
  result?: T;
}

type DelegationItemProps = RequestDelegationItemProps & {
  onRefresh?: () => void;
};

const ProxySellerDelegationItem = ({
  id,
  customerName,
  customerId,
  createdAt,
  status: initialStatus,
  productDescription,
  expectPrice,
  bankAccountNumber,
  bankName,
  accountHolderName,
  imageUrls,
  rejectionReason,
  onRefresh
}: DelegationItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<RequestDelegationStatus>(initialStatus);
  const [rejectReason, setRejectReason] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { message } = App.useApp();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRejectReason('');
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const endpoint = `/api/delegation-requests/${id}/approve`;
      const response = await putData<ApiResponse<void>>(endpoint, {});
      
      if (response && response.code === 200) {
        setStatus('APPROVED');
        message.success(response.message || 'Phê duyệt yêu cầu ủy thác thành công');
        setIsModalOpen(false);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      const errorData = error as ErrorResponse;
      message.error(errorData.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    setRejectLoading(true);
    try {
      const endpoint = `/api/delegation-requests/${id}/reject`;
      const response = await putData<ApiResponse<void>>(endpoint, { reason: rejectReason });
      
      if (response && response.code === 200) {
        setStatus('REJECTED');
        message.success(response.message || 'Từ chối yêu cầu ủy thác thành công');
        setIsModalOpen(false);
        setRejectReason('');
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      const errorData = error as ErrorResponse;
      message.error(errorData.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
    } finally {
      setRejectLoading(false);
    }
  };  
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('vi-VN');
  // };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleStatusSelect = (value: string) => {
    // Chỉ cập nhật UI, không gọi API
    setStatus(value as RequestDelegationStatus);
    message.success('Đã chọn trạng thái: ' + value);
  };

  return (
    <>
      <div className={styles.delegation_proxySellerName}>
        <span>Người bán đại lý</span>
        <p>{customerName}</p>
      </div>
      <div className={styles.delegation_proxySellerId}>
        <span>ID người bán</span>
        <p>{customerId}</p>
      </div>
      <div className={styles.delegation_createDate}>
        <span>Ngày tạo</span>
        <p>{formatDate(createdAt)}</p>
      </div>
      <div className={styles.delegation_status}>
        <span>Trạng thái</span>
        <p style={{ color: RequestDelegationStatusColor[status], fontWeight: 'bold' }}>
          {RequestDelegationStatusText[status]}
        </p>
      </div>
      <div className={styles.delegation_details}>
        <a onClick={showModal} style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}>
          Xem chi tiết
        </a>
      </div>
      <div className={styles.delegation_actions}>
        <Select
          options={[
            { value: 'PRODUCT_RECEIVED', label: 'Đã nhận hàng' },
            { value: 'SELLING', label: 'Đang bán' },
            { value: 'SOLD', label: 'Đã bán' },
            { value: 'PAYMENT_COMPLETED', label: 'Đã thanh toán' },
          ]}
          onChange={handleStatusSelect}
          style={{ width: '140px' }}
          placeholder="Chọn hành động"
        />
      </div>
      

      <Modal
        title={<div className={styles.modalTitle}>Chi tiết yêu cầu ủy thác</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button 
            key="approve" 
            type="primary"
            onClick={handleApprove}
            loading={approveLoading}
            disabled={status !== 'PENDING'}
          >
            Đồng ý
          </Button>,
          <Button 
            key="reject" 
            danger
            onClick={handleReject}
            loading={rejectLoading}
            disabled={status !== 'PENDING'}
          >
            Từ chối
          </Button>,
        ]}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalSection}>
            <h3>Thông tin người bán đại lý</h3>
            <div style={{ display: 'flex', gap: '40px' }}>
              <p><strong>Tên:</strong> {customerName}</p>
              <p><strong>ID:</strong> {customerId}</p>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3>Thông tin sản phẩm</h3>
            <p><strong>Mô tả:</strong> {productDescription}</p>
            <p><strong>Giá mong muốn:</strong> {formatPrice(expectPrice)}</p>
          </div>

          <div className={styles.modalSection}>
            <h3>Thông tin ngân hàng</h3>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '8px' }}>
              <p><strong>Ngân hàng:</strong> {bankName}</p>
              <p><strong>Chủ tài khoản:</strong> {accountHolderName}</p>
            </div>
            <p><strong>Số tài khoản:</strong> {bankAccountNumber}</p>
          </div>

          <div className={styles.modalSection}>
            <h3>Hình ảnh sản phẩm</h3>
            <div className={styles.imageGrid}>
              {imageUrls && imageUrls.length > 0 ? (
                imageUrls.map((image: string, index: number) => (
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

          {status === 'PENDING' && (
            <div className={styles.modalSection}>
              <h3>Lý do từ chối</h3>
              <TextArea
                rows={4}
                placeholder="Nhập lý do từ chối (bắt buộc nếu từ chối)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ marginTop: '10px' }}
              />
            </div>
          )}

          {status === 'REJECTED' && rejectionReason && (
            <div className={styles.modalSection}>
              <h3>Lý do đã từ chối</h3>
              <p style={{ color: '#ff4d4f', fontSize: '15px', fontStyle: 'italic' }}>
                {rejectionReason}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProxySellerDelegationItem;
