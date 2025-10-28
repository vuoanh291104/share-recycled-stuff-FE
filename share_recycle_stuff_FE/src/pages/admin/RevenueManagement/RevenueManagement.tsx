import { Select } from 'antd';
import RevenueItem from './RevenueItem';
import { getData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import type { ProxySellerRevenueResponse } from '../../../types/schema';
import { useMessage } from '../../../context/MessageProvider';
import { useEffect, useState } from 'react';
import styles from './RevenueManagement.module.css';

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  path: string;
  timestamp: string;
  result: T;
}

const RevenueManagement = () => {
  const { showMessage } = useMessage();
  const [revenueList, setRevenueList] = useState<ProxySellerRevenueResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

  // Fetch all revenues
  const getAllRevenues = async (month?: number, year?: number) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: '0',
        size: '50',
        sort: 'year,desc'
      };
      
      if (month) params.month = month.toString();
      if (year) params.year = year.toString();

      const res = await getData<ApiResponse<Page<ProxySellerRevenueResponse>>>('/api/admin/revenue', params);
      
      console.log('Revenue API Response:', res);
      setRevenueList(res.result.content);
    } catch (error) {
      const errorData = error as ErrorResponse;
      console.error('API Error:', errorData);
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
    } finally {
      setLoading(false);
    }
  };

  const onMonthChange = (value?: number) => {
    setSelectedMonth(value);
    getAllRevenues(value, selectedYear);
  };

  const onYearChange = (value?: number) => {
    setSelectedYear(value);
    getAllRevenues(selectedMonth, value);
  };

  useEffect(() => {
    getAllRevenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`
  }));

  // Generate year options (current year and previous 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: currentYear - i,
    label: `Năm ${currentYear - i}`
  }));

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.titleText}>Quản lý doanh thu</div>
        <div className={styles.controls}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Select
              placeholder="Chọn tháng"
              options={monthOptions}
              value={selectedMonth}
              onChange={onMonthChange}
              style={{ width: '150px' }}
              allowClear
            />
            <Select
              placeholder="Chọn năm"
              options={yearOptions}
              value={selectedYear}
              onChange={onYearChange}
              style={{ width: '150px' }}
              allowClear
            />
          </div>
        </div>

        <div className="container">
          <RevenueItem 
            data={revenueList} 
            getAll={getAllRevenues} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;
