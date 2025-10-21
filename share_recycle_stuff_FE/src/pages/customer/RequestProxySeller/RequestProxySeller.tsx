import { useEffect, useState } from 'react';
import { Button, Modal, Table, Tag } from 'antd';
import ModalRequestProxy from './ModalRequestProxy';
import styles from './RequestProxy.module.css';
import type { RequestUpgradeDataProps } from '../../../types/schema';
import { getData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import { formatDate } from '../../../utils/formatters';
import RequestProxyItem from '../../../components/RequestProxyItem/RequestProxyItem';

interface RequestProxySellerProps {
  code: number;
  message: string;
  result: RequestUpgradeDataProps[];
}

const RequestProxySeller = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // <-- modal gửi yêu cầu
  const [selectedRequest, setSelectedRequest] = useState<RequestUpgradeDataProps | null>(null);
  const [requestList, setRequestList] = useState<RequestUpgradeDataProps[]>([]);

  const getListRequestProxy = async () => {
    try {
      const res = await getData<RequestProxySellerProps>('/api/upgrade-request/my-requests');
      setRequestList(res.result);
    } catch (error: any) {
      const errData: ErrorResponse = error;
      console.error("Error fetching request proxy list: ", errData.message);
    }
  };

  useEffect(() => {
    getListRequestProxy();
  }, []);

  // mapping trạng thái
  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Đang chờ", color: "gold" },
    APPROVED: { label: "Đã chấp nhận", color: "green" },
    REJECTED: { label: "Đã từ chối", color: "red" },
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 70,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: number []) => formatDate(text),
    },
    
    {
      title: 'Ngày duyệt',
      dataIndex: 'processedAt',
      key: 'processedAt',
      render: (text: number []) => formatDate(text),
    },
    
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const { label, color } = statusMap[status] || { label: status, color: "default" };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: RequestUpgradeDataProps) => (
        <a
          onClick={() => {
            setSelectedRequest(record);
          }}
        >
          Xem chi tiết
        </a>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.title}>Danh sách yêu cầu</div>

      {/* Nút mở modal gửi yêu cầu */}
      <Button
        type="primary"
        onClick={() => setIsRequestModalOpen(true)}
        className={styles.request_button}
      >
        Gửi yêu cầu
      </Button>

      {/* Bảng danh sách yêu cầu */}
      <Table
        columns={columns}
        dataSource={requestList}
        rowKey="requestId"
        pagination = {{position :['bottomCenter']}}
        className={styles.request_table}
      />

      {/* Modal GỬI YÊU CẦU MỚI */}
      <Modal
        title={<div style={{ fontSize: '24px', textAlign: 'center' }}>Gửi yêu cầu nâng cấp</div>}
        open={isRequestModalOpen}
        footer={null}
        onCancel={() => setIsRequestModalOpen(false)}
        destroyOnClose
      >
        <ModalRequestProxy
          onCancel={() => {
            setIsRequestModalOpen(false);
            getListRequestProxy(); // reload sau khi gửi
          }}
        />
      </Modal>

      {/* Modal CHI TIẾT */}
      <Modal
        title={<div style={{ fontSize: '20px', textAlign: 'center' }}>Chi tiết yêu cầu</div>}
        open={!!selectedRequest}
        footer={null}
        onCancel={() => setSelectedRequest(null)}
        width={600}
      >
        {selectedRequest && (
          <RequestProxyItem
            requestId={selectedRequest.requestId}
            fullName={selectedRequest.fullName}
            email={selectedRequest.email}
            idCard={selectedRequest.idCard}
            idCardFrontImage={selectedRequest.idCardFrontImage}
            idCardBackImage={selectedRequest.idCardBackImage}
            addressDetail={selectedRequest.addressDetail}
            status={selectedRequest.status}
            createdAt={formatDate(selectedRequest.createdAt)}
            processedAt= {formatDate(selectedRequest.processedAt)}
            rejectionReason= {selectedRequest.rejectionReason}
          />
        )}
      </Modal>
    </div>
  );
};

export default RequestProxySeller;
