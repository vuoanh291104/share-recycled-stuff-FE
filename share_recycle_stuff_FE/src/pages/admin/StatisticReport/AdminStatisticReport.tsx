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

interface DelegationStats {
  totalReceived: number;
  pending: number;
  approved: number;
  rejected: number;
  inTransit: number;
  productReceived: number;
  selling: number;
  sold: number;
  paymentCompleted: number;
}

interface SalesAndRevenueStats {
  totalCompletedOrders: number;
  totalSalesAmount: number;
  totalProxyCommission: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface StatisticsReportResponse {
  postStats: PostStats;
  delegationStats: DelegationStats;
  salesAndRevenueStats: SalesAndRevenueStats;
}

const AdminStatisticReport = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<StatisticsReportResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
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

  const fetchMonthlyData = async (endDate?: Date) => {
    try {
      const now = endDate || new Date();
      
      // Tạo array các promises để gọi song song
      const promises = [];
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = targetDate.getMonth() + 1;
        const year = targetDate.getFullYear();
        
        promises.push(
          getData<{ result: StatisticsReportResponse }>('/api/admin/statistics/report', {
            month,
            year
          }).then(res => ({
            month: `${month}/${year}`,
            count: res.result.postStats.totalPosts
          }))
        );
      }
      
      // Gọi tất cả API cùng lúc
      const results = await Promise.all(promises);
      setMonthlyData(results);
    } catch (error) {
      const err = error as { message?: string; status?: number };
      showMessage({ 
        type: 'error', 
        message: err.message || 'Không thể tải dữ liệu theo tháng', 
        code: err.status 
      });
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchMonthlyData();
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
      fetchMonthlyData(); // Fetch 6 tháng mới nhất
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
      // Fetch 6 tháng trước tháng được chọn
      fetchMonthlyData(selectedDate.toDate());
    } else if (filterType === 'year') {
      params.year = selectedDate.year();
    }

    fetchStatistics(params);
  };

  const handleResetFilter = () => {
    setFilterType('all');
    setSelectedDate(null);
    fetchStatistics();
    fetchMonthlyData(); // Reset về 6 tháng mới nhất
  };

  const postChartData = stats ? [
    { name: 'Đang hoạt động', value: stats.postStats.activePosts, color: '#52c41a' },
    { name: 'Yêu cầu chỉnh sửa', value: stats.postStats.editRequestPosts, color: '#faad14' },
    { name: 'Đã xóa', value: stats.postStats.deletedPosts, color: '#ff4d4f' },
  ] : [];

  const delegationChartData = stats ? [
    { name: 'Đang chờ', value: stats.delegationStats.pending, color: '#faad14' },
    { name: 'Đã chấp nhận', value: stats.delegationStats.approved, color: '#52c41a' },
    { name: 'Đã từ chối', value: stats.delegationStats.rejected, color: '#ff4d4f' },
    { name: 'Đang giao', value: stats.delegationStats.inTransit, color: '#1890ff' },
    { name: 'Đã nhận hàng', value: stats.delegationStats.productReceived, color: '#13c2c2' },
    { name: 'Đang bán', value: stats.delegationStats.selling, color: '#722ed1' },
    { name: 'Đã bán', value: stats.delegationStats.sold, color: '#fa8c16' },
    { name: 'Đã thanh toán', value: stats.delegationStats.paymentCompleted, color: '#389e0d' },
  ] : [];

  const totalPosts = stats?.postStats?.totalPosts ?? 0;
  const totalCompletedOrders = stats?.salesAndRevenueStats?.totalCompletedOrders ?? 0;
  const totalRevenue = stats?.salesAndRevenueStats?.totalSalesAmount ?? 0;
  const totalProfit = stats?.salesAndRevenueStats?.totalProxyCommission ?? 0;
  const totalDelegations = stats?.delegationStats?.totalReceived ?? 0;
  const totalCost = totalRevenue - totalProfit;

  const revenueChartData = stats ? [
    { name: 'Lợi nhuận', value: stats.salesAndRevenueStats.totalProxyCommission, color: '#52c41a' },
    { name: 'Chi phí', value: stats.salesAndRevenueStats.totalSalesAmount - stats.salesAndRevenueStats.totalProxyCommission, color: '#ff4d4f' },
  ] : [];

  const barChartData = stats ? [
    { name: 'Doanh thu', value: stats.salesAndRevenueStats.totalSalesAmount, color: '#1890ff' },
    { name: 'Lợi nhuận', value: stats.salesAndRevenueStats.totalProxyCommission, color: '#52c41a' },
    { name: 'Chi phí', value: stats.salesAndRevenueStats.totalSalesAmount - stats.salesAndRevenueStats.totalProxyCommission, color: '#ff4d4f' },
  ] : [];

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
                      <div className={styles.summaryCardTitle}>Tổng số ủy thác</div>
                      <div className={styles.summaryCardValue}>{totalDelegations.toLocaleString()}</div>
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
                      <div className={styles.summaryCardTitle}>Tổng số bài đăng</div>
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
                      <div className={styles.summaryCardTitle}>Lượt bán thành công</div>
                      <div className={styles.summaryCardValue}>{totalCompletedOrders.toLocaleString()}</div>
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
                      <div className={styles.summaryCardTitle}>Phí chiết khấu</div>
                      <div className={styles.summaryCardValue}>{totalProfit.toLocaleString()}</div>
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

            {/* Section 3: Thống kê yêu cầu ủy thác */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Thống kê yêu cầu ủy thác
              </h2>
              
              <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>Phân bố trạng thái ủy thác</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={delegationChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {delegationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => value.toLocaleString()} />
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
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>Số lượng theo trạng thái</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={delegationChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {delegationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </Card>
            </div>

            {/* Section 4: Thống kê doanh thu và lợi nhuận */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Thống kê doanh thu và lợi nhuận
              </h2>
              
              <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>Phân bổ doanh thu</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={revenueChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {revenueChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => value.toLocaleString() + ' VNĐ'} />
                        <Legend verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} lg={12}>
                    <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>So sánh số tiền</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip formatter={(value) => value.toLocaleString() + ' VNĐ'} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </Card>
            </div>

            {/* Section 5: Phân tích tỷ lệ tăng giảm bài đăng so với kỳ trước */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Phân tích số lượng bài đăng theo tháng (6 tháng gần nhất)
              </h2>
              
              <Card>
                {monthlyData.length > 0 ? (
                  <div>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#999"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          formatter={(value) => [`${value} bài đăng`, 'Số lượng']}
                          labelFormatter={(label) => `Tháng ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          name="Số lượng bài đăng"
                          fill="#1890ff" 
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 20, textAlign: 'center' }}>
                      Biểu đồ xu hướng 6 tháng gần nhất
                    </h3>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <p style={{ fontSize: 14, color: '#999', marginTop: 16 }}>Đang tải dữ liệu so sánh...</p>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </Spin>
    </div>
  );
};

export default AdminStatisticReport;
