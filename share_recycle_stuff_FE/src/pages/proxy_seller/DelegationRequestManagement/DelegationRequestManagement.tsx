import { Select } from 'antd';
import type { RequestDelegationItemProps } from '../../../types/schema';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import styles from './DelegationRequestManagement.module.css';
import ProxySellerDelegationItem from '../../../components/RequestDelegationItem/ProxySellerDelegationItem';
import { useMessage } from '../../../context/MessageProvider';

interface ApiResponse<T> {
  code: number;
  message: string;
  path?: string;
  timestamp: string;
  result: T;
}

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

const DelegationRequestManagement = () => {
  const { showMessage } = useMessage();
  const [requestList, setRequestList] = useState<RequestDelegationItemProps[]>([]);
  const [filteredList, setFilteredList] = useState<RequestDelegationItemProps[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  // Fetch all delegation requests
  const getAll = async () => {
    setLoading(true);
    try {
      const res = await getData<ApiResponse<PageResponse<RequestDelegationItemProps>>>(
        '/api/delegation-requests',
        { 
          page: 0, 
          size: 30,
          sort: 'createdAt,desc' 
        }
      );
      setRequestList(res.result.content);
      setFilteredList(res.result.content);
    } catch (error) {
      const errorData = error as ErrorResponse;
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
    } finally {
      setLoading(false);
    }
  };

  // Filter by status
  const onStatusChange = (value?: string) => {
    setSelectedStatus(value || "ALL");
    if (!value || value === "ALL") {
      setFilteredList(requestList);
    } else {
      const filtered = requestList.filter(item => item.status === value);
      setFilteredList(filtered);
    }
  };

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const location = useLocation();
  const isExactPath = location.pathname === '/managedelegations';
  
  if (!isExactPath) {
    return <Outlet />;
  }

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.title}>
          <div style={{ fontSize: 24 }}>Danh sách yêu cầu ủy thác</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Select
            options={[
              { value: "ALL", label: "Tất cả" },
              { value: "PENDING", label: "Đang chờ" },
              { value: "APPROVED", label: "Đã chấp nhận" },
              { value: "REJECTED", label: "Đã từ chối" },
              { value: "PRODUCT_RECEIVED", label: "Đã nhận hàng" },
              { value: "SELLING", label: "Đang bán" },
              { value: "SOLD", label: "Đã bán" },
              { value: "PAYMENT_COMPLETED", label: "Đã thanh toán" },
            ]}
            value={selectedStatus}
            onChange={onStatusChange}
            style={{ width: "150px" }}
          />
        </div>

        <div className='container'>
          <ProxySellerDelegationItem data={filteredList} getAll={getAll} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DelegationRequestManagement;
