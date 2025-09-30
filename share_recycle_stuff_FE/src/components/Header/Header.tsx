import { useState } from 'react';
import Icon from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // ⚡ dùng để chuyển trang
import MenuIcon from '../icons/MenuIcon';
import SearchIcon from '../icons/SearchIcon';
import type { User } from '../../types/schema';
import styles from "./Header.module.css";

type HeaderProps = {
  currentUser: User;
};

const Header = ({ currentUser }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate(); // dùng để điều hướng trang

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  const handleGoToProfile = () => {
    navigate('/profile'); // chuyển sang trang /profile
  };

  return (
    <header className={styles.header}>
      {/* 🔍 Khu vực tìm kiếm */}
      <div className={styles.searchSection}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Icon 
              component={MenuIcon} 
              className={styles.menuIcon}
            />
            <input
              type="text"
              placeholder="Hinted search text"
              className={styles.searchInput}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Icon 
              component={SearchIcon} 
              className={styles.searchIcon}
            />
          </div>
        </form>
      </div>

      {/* 👤 Khu vực người dùng */}
      <div className={styles.userSection}>
        <div 
          className={styles.userInfo} 
          onClick={handleGoToProfile}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={currentUser?.avatar_url || "/avatars/default.png"}
            alt={currentUser?.full_name || "Người dùng"}
            className={styles.userAvatar}
          />
          <span className={styles.userName}>{currentUser?.full_name || "Guest"}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
