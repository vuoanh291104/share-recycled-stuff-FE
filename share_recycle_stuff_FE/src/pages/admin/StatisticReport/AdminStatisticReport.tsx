import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Spin, Space, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import {
  FileTextOutlined,
  DollarOutlined,
  ShopOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getData } from '../../../api/api';
import { useMessage } from '../../../context/MessageProvider';
import styles from './AdminStatisticReport.module.css';

// TypeScript interfaces
interface PostStats {
  totalPosts: number;
  activePosts: number;
  editRequestPosts: number;
  deletedPosts: number;
}

interface StatisticsReportResponse {
  postStats: PostStats;
}

const AdminStatisticReport = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<StatisticsReportResponse | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const fetchStatistics = async (params: Record<string, number> = {}) => {
    setLoading(true);
    try {
      const res = await getData<{ result: StatisticsReportResponse }>('/api/admin/statistics/report', params);
      setStats(res.result);
    } catch (error) {
      const err = error as { message?: string; status?: number };
      showMessage({ 
        type: 'error', 
        message: err.message || 'Không thể tải thống kê', 
        code: err.status 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSelectedDate(null);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleApplyFilter = () => {
    if (filterType === 'all' || !selectedDate) {
      fetchStatistics();
      return;
    }

    const params: Record<string, number> = {};
    
    if (filterType === 'day') {
      params.day = selectedDate.date();
      params.month = selectedDate.month() + 1;
      params.year = selectedDate.year();
    } else if (filterType === 'month') {
      params.month = selectedDate.month() + 1;
      params.year = selectedDate.year();
    } else if (filterType === 'year') {
      params.year = selectedDate.year();
    }

    fetchStatistics(params);
  };

  const handleResetFilter = () => {
    setFilterType('all');
    setSelectedDate(null);
    fetchStatistics();
  };

  if (!stats && !loading) {
    return null;
  }

  if (!stats && !loading) {
    return null;
  }

  // Mock data for category sales (will be replaced when backend is ready)
  const categorySalesData = [
    { name: 'Điện tử', value: 450, color: '#1890ff' },
    { name: 'Thời trang', value: 320, color: '#52c41a' },
    { name: 'Đồ gia dụng', value: 280, color: '#faad14' },
    { name: 'Sách & văn phòng', value: 150, color: '#722ed1' },
    { name: 'Khác', value: 120, color: '#13c2c2' },
  ];

  // Post stats chart data
  const postChartData = stats ? [
    { name: 'Đang hoạt động', value: stats.postStats.activePosts, color: '#52c41a' },
    { name: 'Yêu cầu chỉnh sửa', value: stats.postStats.editRequestPosts, color: '#faad14' },
    { name: 'Đã xóa', value: stats.postStats.deletedPosts, color: '#ff4d4f' },
  ] : [];

  // Calculate stats
  const totalPosts = stats ? stats.postStats.totalPosts : 0;
  const totalSales = categorySalesData.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = 8900000; // Mock data

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Báo cáo & thống kê hệ thống</h1>
        <Space className={styles.filters} size="middle">
          <Select
            value={filterType}
            onChange={handleFilterChange}
            style={{ width: 150 }}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'day', label: 'Theo ngày' },
              { value: 'month', label: 'Theo tháng' },
              { value: 'year', label: 'Theo năm' },
            ]}
          />
          
          {filterType === 'day' && (
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              style={{ width: 200 }}
            />
          )}
          
          {filterType === 'month' && (
            <DatePicker
              picker="month"
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Chọn tháng"
              format="MM/YYYY"
              style={{ width: 200 }}
            />
          )}
          
          {filterType === 'year' && (
            <DatePicker
              picker="year"
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Chọn năm"
              format="YYYY"
              style={{ width: 200 }}
            />
          )}

          {filterType !== 'all' && (
            <>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={handleApplyFilter}
                disabled={!selectedDate}
              >
                Lọc
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleResetFilter}
              >
                Đặt lại
              </Button>
            </>
          )}
        </Space>
      </div>

      <Spin spinning={loading}>
        {stats && (
          <>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.summaryCard}>
                  <div className={styles.summaryCardContent}>
                    <div className={styles.summaryCardLeft}>
                      <div className={styles.summaryCardTitle}>Tổng số bài đăng</div>
                      <div className={styles.summaryCardValue}>{totalPosts.toLocaleString()}</div>
                    </div>
                    <div className={styles.summaryCardIcon} style={{ color: '#1890ff' }}>
                      <FileTextOutlined />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.summaryCard}>
                  <div className={styles.summaryCardContent}>
                    <div className={styles.summaryCardLeft}>
                      <div className={styles.summaryCardTitle}>Lượng bài trong tháng</div>
                      <div className={styles.summaryCardValue}>{totalPosts.toLocaleString()}</div>
                    </div>
                    <div className={styles.summaryCardIcon} style={{ color: '#faad14' }}>
                      <FileTextOutlined />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.summaryCard}>
                  <div className={styles.summaryCardContent}>
                    <div className={styles.summaryCardLeft}>
                      <div className={styles.summaryCardTitle}>Số lượng bài đăng</div>
                      <div className={styles.summaryCardValue}>{totalSales.toLocaleString()}</div>
                    </div>
                    <div className={styles.summaryCardIcon} style={{ color: '#52c41a' }}>
                      <ShopOutlined />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className={styles.summaryCard}>
                  <div className={styles.summaryCardContent}>
                    <div className={styles.summaryCardLeft}>
                      <div className={styles.summaryCardTitle}>Lợi nhuận</div>
                      <div className={styles.summaryCardValue}>{totalRevenue.toLocaleString()}</div>
                    </div>
                    <div className={styles.summaryCardIcon} style={{ color: '#13c2c2' }}>
                      <DollarOutlined />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Section 2: Thống kê số lượng bài đăng */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Thống kê số lượng bài đăng
              </h2>
              
              <Card style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col xs={24} lg={12}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={postChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {postChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Legend verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} lg={12}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={postChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {postChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </Card>
            </div>

            {/* Section 3: Thống kê lượt bán theo phân loại hàng (Mock Data) */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Thống kê lượt bán theo phân loại hàng
              </h2>
              
              <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>Phân bố theo danh mục</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categorySalesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categorySalesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number, name: string) => [`${((value / totalSales) * 100).toFixed(1)}%`, name]} />
                        <Legend 
                          verticalAlign="middle" 
                          align="right"
                          layout="vertical"
                          wrapperStyle={{ paddingLeft: 20 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} lg={12}>
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>Số lượng theo danh mục</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categorySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {categorySalesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </Card>
            </div>

            {/* Section 5: Thống kê phí chiết khấu thu được từ trung gian (Mock) */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Thống kê phí chiết khấu thu được từ trung gian
              </h2>
              
              <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <DollarOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 32, fontWeight: 600, color: '#52c41a', margin: 0 }}>
                    {totalRevenue.toLocaleString()} VNĐ
                  </h3>
                  <p style={{ color: '#8c8c8c', marginTop: 8 }}>Tổng phí chiết khấu thu được</p>
                </div>
              </Card>
            </div>

            {/* Section 6: Phân tích tỷ lệ tăng giảm bài đăng so với kỳ trước (Mock) */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Phân tích tỷ lệ tăng giảm bài đăng so với kỳ trước (tháng, năm)
              </h2>
              
              <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontSize: 16, color: '#8c8c8c', marginBottom: 16 }}>
                    Chức năng đang được phát triển
                  </p>
                  <p style={{ fontSize: 14, color: '#d9d9d9' }}>
                    Sẽ hiển thị biểu đồ so sánh tăng giảm theo thời gian
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </Spin>
    </div>
  );
};

export default AdminStatisticReport;
