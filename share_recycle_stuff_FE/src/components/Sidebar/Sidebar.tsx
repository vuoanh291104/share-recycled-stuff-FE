import { useState } from 'react';
import Icon from '@ant-design/icons';
import { MdNotifications, MdTextSnippet, MdCurrencyExchange, MdHandshake, MdAccountBox, MdReportGmailerrorred,} from 'react-icons/md';

import HomeIcon from '../icons/HomeIcon';
import LanguageIcon from '../icons/LanguageIcon';
import LogoutIcon from '../icons/LogoutIcon';
import styles from "./Sidebar.module.css";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  isActive?: boolean;
}

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Trang chủ', icon: HomeIcon, isActive: true },
    { id: 'notifications', label: 'Thông báo', icon: () => <MdNotifications size={24} /> },
    { id: 'posts', label: 'Quản lí bài đăng', icon: () => <MdTextSnippet size={24} /> },
    { id: 'transactions', label: 'Quản lí giao dịch', icon: () => <MdCurrencyExchange size={24} /> },
    { id: 'delegation', label: 'Ủy thác', icon: () => <MdHandshake size={24} /> },
    { id: 'profile', label: 'Profile', icon: () => <MdAccountBox size={24} /> },
    { id: 'reports', label: 'Khiếu nại & Báo cáo', icon: () => <MdReportGmailerrorred size={24} /> },
    { id: 'language', label: 'Ngôn ngữ', icon: LanguageIcon },
    { id: 'logout', label: 'Đăng xuất', icon: LogoutIcon }
  ];

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'more') {
      setShowMoreMenu(!showMoreMenu);
    } else {
      setActiveItem(itemId);
      setShowMoreMenu(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Recycle Stuff</h2>
      </div>
      <div className={styles.divider}></div>
      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                className={`${styles.menuButton} ${activeItem === item.id ? styles.active : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <Icon 
                  component={item.icon} 
                  className={styles.menuIcon}
                />
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;