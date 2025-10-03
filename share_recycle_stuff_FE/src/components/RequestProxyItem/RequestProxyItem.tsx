import { useState } from 'react';
import { Modal } from 'antd';
import styles from '../../pages/customer/RequestProxySeller/RequestProxy.module.css';
import type {RequestProxySellerItemProps} from '../../types/schema';
import { RequestProxyStatusText } from '../../types/enums';


type RequestProxyItemProps = RequestProxySellerItemProps;

const RequestProxyItem = ({id, createDate, status, processedDate, listCCCDImages, reasonReject} : RequestProxyItemProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

  return (
    <>
        <div className={styles.request_id}>
          <span>ID</span>
          <p>{id}</p>
        </div>
        <div className={styles.request_createDate}>
          <span>Ngày tạo</span>
          <p>{createDate}</p>
        </div>
        <div className={styles.request_status}>
          <span>Trạng thái</span>
          <p>{RequestProxyStatusText[status]}</p>
        </div>
        <div className={styles.request_processedDate}>
          <span>Ngày duyệt</span>
          <p>{processedDate}</p>
        </div>
        <div className={styles.request_details}>
          <span><a onClick={showModal}>Xem chi tiết</a></span>
        </div>

        <Modal
            title="Chi tiết yêu cầu"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            {listCCCDImages?.map((image, index) => (
                <img key={index} className={styles.img} src={image} alt={`CCCD Image ${index + 1}`} />
            ))}
            {status === 'REJECTED' &&
              <div>
                <h3>Lí do từ chối</h3>
                <p>{reasonReject}</p>
              </div>
          }
        </Modal>
    </>
  )
}

export default RequestProxyItem
