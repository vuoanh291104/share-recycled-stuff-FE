import { Image } from 'antd';
import styles from '../../pages/customer/RequestProxySeller/RequestProxy.module.css';

interface RequestProxyItemProps {
  requestId: number;
  fullName: string;
  email: string;
  idCard: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  addressDetail: string;
  status: string;
  createdAt: string;
  processedAt: string,
  rejectionReason : string
}

const RequestProxyItem = ({
  fullName,
  email,
  idCard,
  idCardFrontImage,
  idCardBackImage,
  addressDetail,
  status,
  createdAt,
  processedAt,
  rejectionReason
}: RequestProxyItemProps) => {
  return (
    <div>
      <p><b>Họ tên:</b> {fullName}</p>
      <p><b>Email:</b> {email}</p>
      <p><b>CCCD:</b> {idCard}</p>
      <p><b>Địa chỉ:</b> {addressDetail}</p>
      <p><b>Ngày tạo:</b> {createdAt}</p>
      {processedAt && <p><b>Ngày duyệt:</b> {processedAt}</p> }
      <div style={{ display: 'flex', gap: 12 }}>
        <Image.PreviewGroup>
          {idCardFrontImage && (
            <Image width={150} src={idCardFrontImage} alt="CCCD mặt trước" style={{ borderRadius: 8 }} />
          )}
          {idCardBackImage && (
            <Image width={150} src={idCardBackImage} alt="CCCD mặt sau" style={{ borderRadius: 8 }} />
          )}
        </Image.PreviewGroup>
      </div>

      {status === 'REJECTED' && (
        <div style={{ marginTop: 10 }}>
          <h3>Lý do từ chối</h3>
          <p>{rejectionReason}</p>
        </div>
      )}
    </div>
  );
};

export default RequestProxyItem;
