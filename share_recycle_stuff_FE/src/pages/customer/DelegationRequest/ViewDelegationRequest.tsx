import { Select, Button } from 'antd';
import type { RequestDelegationItemProps } from '../../../types/schema';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import styles from './ViewDelegationRequest.module.css';
import DelegationItem from '../../../components/RequestDelegationItem/DelegationItem';
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

const ViewDelegationRequest = () => {
  const navigate = useNavigate();
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
          size: 50, // Giảm xuống 50 items để load nhanh hơn
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

  const handleCreateRequest = () => {
    navigate('/delegations/new');
  };

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const location = useLocation();
  const isExactPath = location.pathname === '/delegations';
  
  if (!isExactPath) {
    return <Outlet />;
  }

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.title}>
          <div style={{ fontSize: 24 }}>Danh sách yêu cầu ủy thác</div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px' 
        }}>
          <Button 
            type="primary" 
            onClick={handleCreateRequest}
            style={{ 
              backgroundColor: '#17a2b8',
              borderColor: '#17a2b8',
              borderRadius: '6px',
              padding: '8px 24px',
              height: 'auto',
              fontSize: '14px'
            }}
          >
            Tạo mới yêu cầu
          </Button>
          
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
          <DelegationItem data={filteredList} getAll={getAll} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ViewDelegationRequest;
