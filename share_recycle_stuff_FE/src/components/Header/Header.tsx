import { useState } from 'react';
import Icon from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // ⚡ dùng để chuyển trang
import MenuIcon from '../icons/MenuIcon';
import SearchIcon from '../icons/SearchIcon';
import type { User } from '../../types/schema';
import styles from "./Header.module.css";


const Header = () => {

  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate(); // dùng để điều hướng trang

  const userInfo = localStorage.getItem("userInfo");

  type BasicUser = Pick<User, "account_id" | "full_name" | "avatar_url">;

  let currentUser: BasicUser | null = null;

    if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      currentUser = {
        account_id: parsed.accountId ?? 0,
        full_name: parsed.fullName ?? "",
        avatar_url: parsed.avatarUrl ?? "",
      };
    } catch (err) {
      console.error("Lỗi parse userInfo:", err);
    }
  }

  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  const handleGoToProfile = () => {
    navigate('/profile'); 
  };

  return (
    <header className={styles.header}>
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
