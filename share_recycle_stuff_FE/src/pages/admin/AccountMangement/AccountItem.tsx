import { useState } from 'react';
import { Table, Tag, Modal, Button, Checkbox, Select } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { UserDetailResponse } from '../../../types/schema';
import { formatDate } from '../../../utils/formatters';
import { putData, postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import { useMessage } from '../../../context/MessageProvider';
import styles from './AccountItem.module.css';

interface AccountItemProps {
  data: UserDetailResponse[];
  getAll: () => void;
  loading?: boolean;
  selectedUserIds: number[];
  setSelectedUserIds: (ids: number[]) => void;
}

const AccountItem = ({ data, getAll, loading, selectedUserIds, setSelectedUserIds }: AccountItemProps) => {
  const { showMessage } = useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Lấy email của user đang đăng nhập
  const getUserEmail = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return user.email || '';
      }
      return '';
    } catch {
      return '';
    }
  };
  
  const currentUserEmail = getUserEmail();
  
  console.log('Current user email:', currentUserEmail);

  const statusMap = {
    ACTIVE: { color: 'green', text: 'Hoạt động' },
    INACTIVE: { color: 'red', text: 'Không hoạt động' },
    PENDING: { color: 'orange', text: 'Chờ xử lý' },
    LOCKED: { color: 'volcano', text: 'Đã khóa' },
    DELETED: { color: 'default', text: 'Đã xóa' },
  };

  const roleMap = {
    CUSTOMER: 'Khách hàng',
    PROXY_SELLER: 'Người bán đại lý',
    ADMIN: 'Quản trị viên',
  };

  const handleViewDetail = (record: UserDetailResponse) => {
    setSelectedUser(record);
    setIsDetailModalOpen(true);
  };

  const handleUnlockAccount = async (userId: number) => {
    setIsUnlocking(true);
    
    // Optimistic update: Đóng modal và refresh ngay lập tức
    setIsDetailModalOpen(false);
    showMessage({ type: 'success', message: 'Đang mở khóa tài khoản...' });
    
    try {
      await putData(`/api/admin/accounts/${userId}/unlock`, {});
      // API thành công, refresh để đảm bảo data chính xác
      getAll();
    } catch (error) {
      const errorData = error as ErrorResponse;
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
      // Nếu lỗi, vẫn refresh để đồng bộ với server
      getAll();
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleRoleChange = async (userId: number, selectedRoles: string[]) => {
    try {
      // Lấy roles hiện tại của user
      const currentUser = data.find(user => user.userId === userId);
      if (!currentUser) return;

      const currentRoles = currentUser.roles as string[];
      
      // Tìm roles cần thêm (có trong selectedRoles nhưng không có trong currentRoles)
      const rolesToAssign = selectedRoles.filter(role => !currentRoles.includes(role));
      
      // Tìm roles cần xóa (có trong currentRoles nhưng không có trong selectedRoles)
      const rolesToRevoke = currentRoles.filter(role => !selectedRoles.includes(role));

      // Assign roles mới
      for (const role of rolesToAssign) {
        await postData('/api/admin/roles/assign', {
          userId: userId,
          role: role
        });
      }

      // Revoke roles bị bỏ
      for (const role of rolesToRevoke) {
        await postData('/api/admin/roles/revoke', {
          userId: userId,
          role: role
        });
      }

      showMessage({ type: 'success', message: 'Cập nhật phân quyền thành công' });
      getAll();
    } catch (error) {
      const errorData = error as ErrorResponse;
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
      // Reload để revert về trạng thái cũ nếu có lỗi
      getAll();
    }
  };

  const columns: ColumnsType<UserDetailResponse> = [
    {
      title: '',
      dataIndex: 'checkbox',
      width: 50,
      render: (_: unknown, record: UserDetailResponse) => (
        <Checkbox
          checked={selectedUserIds.includes(record.userId)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUserIds([...selectedUserIds, record.userId]);
            } else {
              setSelectedUserIds(selectedUserIds.filter((id) => id !== record.userId));
            }
          }}
        />
      ),
    },
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 70,
      render: (_: unknown, __: UserDetailResponse, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_: unknown, record: UserDetailResponse) => {
        const status = record.isLocked ? 'LOCKED' : record.status;
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Phân quyền',
      dataIndex: 'roles',
      key: 'roles',
      width: 200,
      render: (roles: string[], record: UserDetailResponse) => {
        // Không cho phép admin tự thay đổi role của chính mình
        const isCurrentUser = record.email === currentUserEmail;
        
        return (
          <Select
            mode="multiple"
            value={roles}
            onChange={(selectedRoles) => handleRoleChange(record.userId, selectedRoles)}
            disabled={isCurrentUser}
            style={{ width: '100%' }}
            options={[
              { value: 'CUSTOMER', label: 'Khách hàng' },
              { value: 'PROXY_SELLER', label: 'Người bán đại lý' },
              { value: 'ADMIN', label: 'Quản trị viên' },
            ]}
          />
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: 120,
      render: (_: unknown, record: UserDetailResponse) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const onPaginationChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="userId"
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          pageSize: 10,
          current: currentPage,
        }}
        onChange={onPaginationChange}
      />

      <Modal
        title="Chi tiết tài khoản"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={
          selectedUser && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {selectedUser.isLocked && (
                  <Button 
                    type="primary" 
                    onClick={() => handleUnlockAccount(selectedUser.userId)}
                    loading={isUnlocking}
                  >
                    Mở khóa
                  </Button>
                )}
              </div>
              <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
            </div>
          )
        }
        width={560}
      >
        {selectedUser && (
          <div className={styles.modalContent}>
            <div className={styles.infoRow}>
              <span className={styles.label}>User ID:</span>
              <span>{selectedUser.userId}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span>{selectedUser.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Họ và tên:</span>
              <span>{selectedUser.fullName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Số điện thoại:</span>
              <span>{selectedUser.phoneNumber || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Địa chỉ:</span>
              <span>{selectedUser.address || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Trạng thái:</span>
              <Tag color={selectedUser.isLocked ? 'volcano' : 'green'}>
                {selectedUser.isLocked ? 'Đã khóa' : statusMap[selectedUser.status].text}
              </Tag>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Vai trò:</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {selectedUser.roles.map((role) => (
                  <Tag key={role} color="blue">
                    {roleMap[role as keyof typeof roleMap]}
                  </Tag>
                ))}
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Lý do khóa:</span>
              <span>{selectedUser.lockReason || 'N/A'}</span>
            </div>
            {selectedUser.isLocked && (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Thời gian khóa:</span>
                  <span>{selectedUser.lockedAt ? formatDate(selectedUser.lockedAt) : 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Người khóa:</span>
                  <span>{selectedUser.lockedBy || 'N/A'}</span>
                </div>
              </>
            )}
            <div className={styles.infoRow}>
              <span className={styles.label}>Ngày tạo:</span>
              <span>{selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Cập nhật lần cuối:</span>
              <span>{selectedUser.updatedAt ? formatDate(selectedUser.updatedAt) : 'N/A'}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AccountItem;
