import { useState } from 'react';
import { Modal, Button, App, Select } from 'antd';
import styles from '../../pages/proxy_seller/DelegationRequestManagement/DelegationRequestManagement.module.css';
import type { RequestDelegationItemProps } from '../../types/schema';
import { RequestDelegationStatusText, RequestDelegationStatusColor, type RequestDelegationStatus } from '../../types/enums';

type DelegationItemProps = RequestDelegationItemProps & {
  onRefresh?: () => void;
};

const ProxySellerDelegationItem = ({
  customerName,
  customerId,
  createdAt,
  status: initialStatus,
  productDescription,
  expectPrice,
  bankAccountNumber,
  bankName,
  accountHolderName,
  imageUrls
}: DelegationItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<RequestDelegationStatus>(initialStatus);
  const { message } = App.useApp();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

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

          {status === 'REJECTED' && (
            <div className={styles.modalSection}>
              <h3>Lý do từ chối</h3>
              <p>Yêu cầu của bạn đã bị từ chối</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProxySellerDelegationItem;
