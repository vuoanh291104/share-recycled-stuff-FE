import { useState } from 'react';
import { Button, Modal } from 'antd';
import ModalRequestProxy from './ModalRequestProxy';
import styles from './RequestProxy.module.css';
import RequestProxyItem from '../../../components/RequestProxyItem/RequestProxyItem';

const RequestProxySeller = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    console.log("Modal Cancel");
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Danh sách yêu cầu</div>
      <Button 
        type="primary" 
        onClick={showModal}
        className={styles.request_button}
      >Gửi yêu cầu</Button>

      <div className={styles.request_list}>
        <RequestProxyItem            // Test thử, call API rồi map sau
        id={1}
        createDate="2025-10-01"
        status="REJECTED"
        processedDate="2025-10-02"
        listCCCDImages={["https://eidcheck.com.vn/wp-content/uploads/2025/01/image-16.png", "https://eidcheck.com.vn/wp-content/uploads/2025/01/image-16.png"]}
        reasonReject="Yêu cầu không hợp lệ"
        />
      </div>
      
      <Modal
        title={<div style={{ fontSize: '24px', textAlign: 'center' }}>Thông tin</div>}
        open={isModalOpen}
        footer={null}   
        onCancel={handleCancel}
      >
        <ModalRequestProxy onCancel={handleCancel} />
      </Modal>
    </div>
  )
}

export default RequestProxySeller;
