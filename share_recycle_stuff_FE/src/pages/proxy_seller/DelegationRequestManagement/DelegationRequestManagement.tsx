import { Select, Spin, Pagination, App } from 'antd';
import type { RequestDelegationItemProps } from '../../../types/schema';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import styles from './DelegationRequestManagement.module.css';
import ProxySellerDelegationItem from '../../../components/RequestDelegationItem/ProxySellerDelegationItem';

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
  const { message } = App.useApp();
  const [requestList, setRequestList] = useState<RequestDelegationItemProps[]>([]);
  const [filteredList, setFilteredList] = useState<RequestDelegationItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Fetch delegation requests from API
  const fetchDelegationRequests = async (page: number = 0, status?: string, sort: 'desc' | 'asc' = 'desc') => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        size: pageSize,
        sort: `createdAt,${sort}`
      };

      const endpoint = '/api/delegation-requests';
      const apiResponse = await getData<ApiResponse<PageResponse<RequestDelegationItemProps>>>(endpoint, params);
      
      if (apiResponse && apiResponse.result) {
        setRequestList(apiResponse.result.content);
        setTotalElements(apiResponse.result.totalElements);
        
        if (status && status !== "ALL") {
          const filtered = apiResponse.result.content.filter(item => item.status === status);
          setFilteredList(filtered);
        } else {
          setFilteredList(apiResponse.result.content);
        }
      }
    } catch (error) {
      const errorData = error as ErrorResponse;
      console.error('API Error:', errorData);
      message.error(errorData.message || 'Không thể tải danh sách yêu cầu ủy thác');
      setRequestList([]);
      setFilteredList([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const onStatusChange = (value?: string) => {
    setSelectedStatus(value || "ALL");
    if (!value || value === "ALL") {
      setFilteredList(requestList);
    } else {
      const filtered = requestList.filter(item => item.status === value);
      setFilteredList(filtered);
    }
  };

  const onSortChange = (value: 'desc' | 'asc') => {
    setSortOrder(value);
    fetchDelegationRequests(currentPage, selectedStatus, value);
  };

  const handleRefresh = () => {
    fetchDelegationRequests(currentPage, selectedStatus, sortOrder);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); 
    fetchDelegationRequests(page - 1, selectedStatus, sortOrder);
  };

  useEffect(() => {
    fetchDelegationRequests(0, "ALL", 'desc');
  }, []);
  
  const location = useLocation();
  const isExactPath = location.pathname === '/managedelegations';
  
  if (!isExactPath) {
    return <Outlet />;
  }
  return (
    <div className={styles.page}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Đang tải danh sách..." />
        </div>
      ) : (
        <div>
          <div className={styles.title}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>Danh sách ủy thác</div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            marginBottom: '24px' 
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Select
                options={[
                  { value: 'desc', label: 'Mới nhất' },
                  { value: 'asc', label: 'Cũ nhất' },
                ]}
                value={sortOrder}
                onChange={onSortChange}
                style={{ width: "150px" }}
                placeholder="Sắp xếp"
              />
              
              <Select
                options={[
                  { value: "ALL", label: "ALL" },
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
                placeholder="Lọc theo trạng thái"
              />
            </div>
          </div>

          <div className={styles.delegation_list}>
            <div className={styles.delegation_list_header}>
              <div className={styles.delegation_proxySellerName}>Người ủy thác</div>
              <div className={styles.delegation_proxySellerId}>ID </div>
              <div className={styles.delegation_createDate}>Ngày tạo</div>
              <div className={styles.delegation_status}>Trạng thái</div>
              <div className={styles.delegation_details}>Thông tin chi tiết</div>
              <div className={styles.delegation_actions}>Hành động</div>
            </div>

            {filteredList.length > 0 ? (
              filteredList.map((request) => (
                <div key={request.id} className={styles.delegation_list_item}>
                  <ProxySellerDelegationItem {...request} onRefresh={handleRefresh} />
                </div>
              ))
            ) : (
              <div className={styles.empty_message}>Không có yêu cầu nào</div>
            )}
          </div>

          {/* Pagination */}
          {totalElements > pageSize && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Pagination
                current={currentPage + 1}
                total={totalElements}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Tổng ${total} yêu cầu`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DelegationRequestManagement;
