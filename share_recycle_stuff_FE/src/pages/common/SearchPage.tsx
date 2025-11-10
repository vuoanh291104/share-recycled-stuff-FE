import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Select, Pagination, Empty, Spin, Tabs } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getData } from '../../api/api';
import { Categories } from '../../constant/Category';
import { PostPurposeValues } from '../../constant/PostPurpose';
import PostCard from '../../components/Feed/PostCard';
import UserSearchCard from '../../components/Feed/UserSearchCard';
import { formatDate } from '../../utils/formatters';
import type { Post, UserInfo } from '../../types/schema';
import styles from './SearchPage.module.css';

const { Option } = Select;

interface Province {
  code: number;
  name: string;
}

interface AuthorSummary {
  id: number;
  displayName: string;
  avatarUrl: string;
}

interface SearchResult {
  id: number;
  title: string;
  price: number;
  thumbnailUrl: string;
  location: string;
  categoryName: string;
  purposeName: string;
  createdAt: string;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  author: AuthorSummary;
}

interface SearchApiResponse {
  code: number;
  message: string;
  result: {
    content: SearchResult[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

interface UserSearchResult {
  id: number;
  displayName: string;
  avatarUrl: string;
  location?: string;
  isProxySeller: boolean;
  averageRating?: number;
}

interface UserSearchApiResponse {
  code: number;
  message: string;
  result: {
    content: UserSearchResult[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>(
    searchParams.get('tab') as 'posts' | 'users' || 'posts'
  );
  
  // Đọc trực tiếp từ URL params (source of truth)
  const keyword = searchParams.get('keyword') || '';
  
  // Filter inputs - local state cho UI, sync vào URL khi click "Lọc"
  const [categoryIdInput, setCategoryIdInput] = useState<number | undefined>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  );
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
  const [purposeInput, setPurposeInput] = useState(searchParams.get('purpose') || '');
  const [isProxySellerInput, setIsProxySellerInput] = useState<boolean | undefined>(
    searchParams.get('isProxySeller') ? searchParams.get('isProxySeller') === 'true' : undefined
  );
  
  // Actual filter values từ URL
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const location = searchParams.get('location') || '';
  const purpose = searchParams.get('purpose') || '';
  const isProxySeller = searchParams.get('isProxySeller') ? searchParams.get('isProxySeller') === 'true' : undefined;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [cities, setCities] = useState<Province[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("/api-provinces/p/");
        setCities(res.data);
      } catch (err) {
        console.error("Lỗi khi load tỉnh/thành phố:", err);
      }
    };
    fetchCities();
  }, []);

  // Get current user from localStorage
  const userInfo = localStorage.getItem("userInfo");
  let currentUser: UserInfo | undefined;
  
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      currentUser = {
        id: parsed.accountId ?? 0,
        fullName: parsed.fullName ?? "",
        avatarUrl: parsed.avatarUrl ?? "",
        email: parsed.email ?? "",
      };
    } catch (err) {
      console.error("Error parsing userInfo:", err);
    }
  }

  useEffect(() => {
    // Tab "Người dùng" - luôn hiển thị danh sách
    if (activeTab === 'users') {
      performUserSearch();
      return;
    }
    
    // Tab "Bài đăng" - chỉ search khi có keyword hoặc filter
    if (!keyword && !categoryId && !location && !purpose) {
      setResults([]);
      setPosts([]);
      setTotalElements(0);
      return;
    }
    
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentPage, activeTab]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage - 1,
        size: pageSize,
      };
      
      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (location) params.location = location;
      if (purpose) params.purpose = purpose;

      const response = await getData<SearchApiResponse>('/api/post/search', params);
      
      setResults(response.result.content);
      setTotalElements(response.result.totalElements);
      
      // Convert SearchResult to Post format for PostCard
      const convertedPosts: Post[] = response.result.content.map((result) => ({
        id: result.id,
        title: result.title,
        content: '', // Search API không trả content, sẽ load khi click vào post
        category: result.categoryName,
        price: result.price,
        purpose: result.purposeName,
        status: 'ACTIVE' as const,
        viewCount: result.viewCount || 0,
        createdAt: formatDate(result.createdAt), // Format về DD/MM/YYYY
        updatedAt: formatDate(result.createdAt),
        author: {
          id: result.author.id,
          fullName: result.author.displayName,
          avatarUrl: result.author.avatarUrl,
          email: '',
        },
        images: result.thumbnailUrl ? [{ 
          id: 0,
          imageUrl: result.thumbnailUrl,
          displayOrder: 0,
        }] : [],
      }));
      
      setPosts(convertedPosts);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setPosts([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const performUserSearch = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        page: currentPage - 1,
        size: pageSize,
      };
      
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (isProxySeller !== undefined) params.isProxySeller = isProxySeller;

      const response = await getData<UserSearchApiResponse>('/api/user/search', params);
      
      setUsers(response.result.content);
      setTotalElements(response.result.totalElements);
    } catch (error) {
      console.error('User search error:', error);
      setUsers([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword; // Giữ nguyên keyword từ URL
    if (categoryIdInput) params.categoryId = String(categoryIdInput);
    if (locationInput) params.location = locationInput;
    if (purposeInput) params.purpose = purposeInput;
    if (isProxySellerInput !== undefined) params.isProxySeller = String(isProxySellerInput);
    
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostActionSuccess = () => {
    performSearch(); // Refresh results after action
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.filterSection}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as 'posts' | 'users');
            const params: Record<string, string> = { tab: key };
            if (keyword) params.keyword = keyword;
            setSearchParams(params);
            setCurrentPage(1);
          }}
          className={styles.tabs}
          items={[
            { key: 'posts', label: 'Bài đăng' },
            { key: 'users', label: 'Người dùng' }
          ]}
        />
        
        {activeTab === 'posts' ? (
          <div className={styles.filters}>
            <Select
              placeholder="Danh mục"
              value={categoryIdInput}
              onChange={setCategoryIdInput}
              allowClear
              className={styles.filterSelect}
              size="large"
            >
              {Categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.description}
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Mục đích"
              value={purposeInput}
              onChange={setPurposeInput}
              allowClear
              className={styles.filterSelect}
              size="large"
            >
              {PostPurposeValues.map((p) => (
                <Option key={p.code} value={p.code}>
                  {p.description}
                </Option>
              ))}
            </Select>
            
            <button 
              onClick={handleFilterChange}
              className={styles.searchButton}
            >
              <SearchOutlined /> Lọc
            </button>
          </div>
        ) : (
          <div className={styles.filters}>
            <Select
              placeholder="Tỉnh/Thành phố"
              value={locationInput}
              onChange={setLocationInput}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              className={styles.filterSelect}
              size="large"
              options={cities.map((city) => ({
                label: city.name,
                value: city.name,
              }))}
            />
            
            <Select
              placeholder="Loại người dùng"
              value={isProxySellerInput}
              onChange={setIsProxySellerInput}
              allowClear
              className={styles.filterSelect}
              size="large"
            >
              <Option value={true}>Proxy Seller</Option>
              <Option value={false}>Customer</Option>
            </Select>
            
            <button 
              onClick={handleFilterChange}
              className={styles.searchButton}
            >
              <SearchOutlined /> Lọc
            </button>
          </div>
        )}
      </div>

      <div className={styles.resultsSection}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" tip="Đang tìm kiếm..." />
          </div>
        ) : (activeTab === 'posts' ? results.length === 0 : users.length === 0) ? (
          <Empty
            description="Không tìm thấy kết quả nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <div className={styles.resultsHeader}>
              <h3>Tìm thấy {totalElements} kết quả</h3>
            </div>
            
            {activeTab === 'posts' ? (
              <div className={styles.postsContainer}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onActionSuccess={handlePostActionSuccess}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.usersContainer}>
                {users.map((user) => (
                  <UserSearchCard key={user.id} user={user} />
                ))}
              </div>
            )}
            
            {totalElements > pageSize && (
              <div className={styles.paginationContainer}>
                <Pagination
                  current={currentPage}
                  total={totalElements}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total) => `Tổng ${total} ${activeTab === 'posts' ? 'bài đăng' : 'người dùng'}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
