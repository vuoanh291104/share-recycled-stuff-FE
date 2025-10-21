import { useState } from 'react';
import { Modal, Button, App } from 'antd';
import styles from '../../pages/customer/DelegationRequest/ViewDelegationRequest.module.css';
import type { RequestDelegationItemProps } from '../../types/schema';
import { RequestDelegationStatusText, RequestDelegationStatusColor, type RequestDelegationStatus } from '../../types/enums';
import type { ErrorResponse } from '../../api/api';
import { formatDate } from '../../utils/formatters';

type DelegationItemProps = RequestDelegationItemProps & {
  onRefresh?: () => void;
};

const DelegationItem = ({
  proxySellerName,
  proxySellerId,
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
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [status, setStatus] = useState<RequestDelegationStatus>(initialStatus);
  const { message } = App.useApp();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const handleDelivery = async () => {
    setDeliveryLoading(true);
    try {
      // TODO: Uncomment when backend API is ready
      // await putData(`/api/delegation-requests/${id}/deliver`, {});

      // TEMPORARY: Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('PRODUCT_RECEIVED');
      message.success('Xác nhận đã giao hàng thành công!');
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      const ErrorData = error as ErrorResponse;
      message.error(ErrorData.message || 'Có lỗi xảy ra khi xác nhận giao hàng');
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setPaymentLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('PAYMENT_COMPLETED'); 
      message.success('Xác nhận thanh toán thành công!');
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      const ErrorData = error as ErrorResponse;
      message.error(ErrorData.message || 'Có lỗi xảy ra khi xác nhận thanh toán');
    } finally {
      setPaymentLoading(false);
    }
  };

  const canDeliver = status === 'APPROVED';
  const canConfirmPayment = status === 'SOLD';

  return (
    <>
      <div className={styles.delegation_proxySellerName}>
        <span>Người bán đại lý</span>
        <p>{proxySellerName}</p>
      </div>
      <div className={styles.delegation_proxySellerId}>
        <span>ID người bán</span>
        <p>{proxySellerId}</p>
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
            key="delivery" 
            type="default"
            onClick={handleDelivery} 
            loading={deliveryLoading}
            disabled={!canDeliver}
            style={{
              backgroundColor: canDeliver ? '#52c41a' : undefined,
              borderColor: canDeliver ? '#52c41a' : undefined,
              color: canDeliver ? '#fff' : undefined
            }}
          >
            Đã giao hàng
          </Button>,
          <Button 
            key="payment" 
            type="primary" 
            onClick={handleConfirmPayment} 
            loading={paymentLoading}
            disabled={!canConfirmPayment}
          >
            Xác nhận thanh toán
          </Button>,
        ]}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalSection}>
            <h3>Thông tin người bán đại lý</h3>
            <div style={{ display: 'flex', gap: '40px' }}>
              <p><strong>Tên:</strong> {proxySellerName}</p>
              <p><strong>ID:</strong> {proxySellerId}</p>
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
              <p style={{ color: '#ff4d4f', fontSize: '15px' }}>
                {rejectionReason || 'Yêu cầu của bạn đã bị từ chối'}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DelegationItem;
