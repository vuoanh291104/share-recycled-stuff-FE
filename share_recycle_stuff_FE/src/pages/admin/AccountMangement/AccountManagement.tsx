import { Select, Button } from 'antd';
import AccountItem from './AccountItem';
import { getData, postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import type { UserDetailResponse } from '../../../types/schema';
import { useMessage } from '../../../context/MessageProvider';
import { useEffect, useState } from 'react';
import styles from './AccountManagement.module.css';

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const AccountManagement = () => {
  const { showMessage } = useMessage();
  const [userList, setUserList] = useState<UserDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // Fetch all users
  const getAllUsers = async (role?: string, status?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      console.log('Token:', token ? 'exists' : 'missing');
      
      const params: Record<string, string> = {
        page: '0',
        size: '50',
        sort: 'createdAt,desc'
      };
      
      if (role && role !== 'ALL') params.role = role;
      if (status && status !== 'ALL') params.status = status;

      const res = await getData<Page<UserDetailResponse>>('/api/admin/accounts/users', params);
      
      console.log('API Response:', res);
      console.log('User List:', res.content);

      setUserList(res.content);
    } catch (error) {
      const errorData = error as ErrorResponse;
      console.error('API Error:', errorData);
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = (value?: string) => {
    setSelectedRole(value || 'ALL');
    getAllUsers(value, selectedStatus);
  };

  const onStatusChange = (value?: string) => {
    setSelectedStatus(value || 'ALL');
    getAllUsers(selectedRole, value);
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bulk lock accounts
  const handleBulkLock = async () => {
    if (selectedUserIds.length === 0) {
      showMessage({ type: 'error', message: 'Vui lòng chọn ít nhất một tài khoản' });
      return;
    }

    const reason = prompt('Nhập lý do khóa tài khoản:');
    if (!reason || reason.trim().length < 5) {
      showMessage({ type: 'error', message: 'Lý do phải có ít nhất 5 ký tự' });
      return;
    }

    // Optimistic update: Cập nhật UI ngay lập tức
    const previousUserList = [...userList];
    const LOCKED_STATUS = 'LOCKED' as const;
    const updatedList = userList.map(user => 
      selectedUserIds.includes(user.userId)
        ? { ...user, isLocked: true, lockReason: reason.trim(), status: LOCKED_STATUS }
        : user
    );
    setUserList(updatedList);
    setSelectedUserIds([]);
    showMessage({ type: 'success', message: `Đang khóa ${selectedUserIds.length} tài khoản...` });

    // Gọi API trong background
    try {
      await postData('/api/admin/accounts/bulk/lock', {
        accountIds: selectedUserIds,
        reason: reason.trim(),
        durationMinutes: null
      });
      // API thành công, refresh để lấy data chính xác từ server
      await getAllUsers(selectedRole, selectedStatus);
    } catch (error) {
      // API thất bại, revert lại UI
      setUserList(previousUserList);
      const errorData = error as ErrorResponse;
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
    }
  };

  // Bulk unlock accounts
  const handleBulkUnlock = async () => {
    if (selectedUserIds.length === 0) {
      showMessage({ type: 'error', message: 'Vui lòng chọn ít nhất một tài khoản' });
      return;
    }

    // Optimistic update: Cập nhật UI ngay lập tức
    const previousUserList = [...userList];
    const ACTIVE_STATUS = 'ACTIVE' as const;
    const updatedList = userList.map(user => 
      selectedUserIds.includes(user.userId)
        ? { ...user, isLocked: false, lockReason: undefined, status: ACTIVE_STATUS }
        : user
    );
    setUserList(updatedList);
    setSelectedUserIds([]);
    showMessage({ type: 'success', message: `Đang mở khóa ${selectedUserIds.length} tài khoản...` });

    // Gọi API trong background
    try {
      await postData('/api/admin/accounts/bulk/unlock', {
        accountIds: selectedUserIds
      });
      // API thành công, refresh để lấy data chính xác từ server
      await getAllUsers(selectedRole, selectedStatus);
    } catch (error) {
      // API thất bại, revert lại UI
      setUserList(previousUserList);
      const errorData = error as ErrorResponse;
      showMessage({ type: 'error', message: errorData.message, code: errorData.status });
    }
  };

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.titleText}>Quản lý tài khoản</div>
        <div className={styles.controls}>
          <div className={styles.actionButtons}>
            <Button type="primary" onClick={handleBulkLock}>Khóa tài khoản</Button>
            <Button onClick={handleBulkUnlock}>Mở khóa</Button>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Select
              options={[
                { value: 'ALL', label: 'Tất cả vai trò' },
                { value: 'CUSTOMER', label: 'Khách hàng' },
                { value: 'PROXY_SELLER', label: 'Người bán đại lý' },
                { value: 'ADMIN', label: 'Quản trị viên' },
              ]}
              value={selectedRole}
              onChange={onRoleChange}
              style={{ width: '150px' }}
            />
            <Select
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'LOCKED', label: 'Đã khóa' },
              ]}
              value={selectedStatus}
              onChange={onStatusChange}
              style={{ width: '150px' }}
            />
          </div>
        </div>

        <div className="container">
          <AccountItem 
            data={userList} 
            getAll={getAllUsers} 
            loading={loading}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
