import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '@ant-design/icons';
import { MdNotifications, MdTextSnippet, MdCurrencyExchange, MdHandshake, MdAccountBox, MdReportGmailerrorred } from 'react-icons/md';
import { TbArrowBigUpLines } from "react-icons/tb";

import HomeIcon from '../icons/HomeIcon';
import LanguageIcon from '../icons/LanguageIcon';
import LogoutIcon from '../icons/LogoutIcon';
import styles from "./Sidebar.module.css";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');

  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Trang chủ', icon: HomeIcon },
    { id: 'notifications', label: 'Thông báo', icon: () => <MdNotifications size={24} /> },
    { id: 'posts', label: 'Quản lí bài đăng', icon: () => <MdTextSnippet size={24} /> },
    { id: 'transactions', label: 'Quản lí giao dịch', icon: () => <MdCurrencyExchange size={24} /> },
    { id: 'delegation', label: 'Ủy thác', icon: () => <MdHandshake size={24} /> },
    { id: 'profile', label: 'Profile', icon: () => <MdAccountBox size={24} /> },
    { id: 'reports', label: 'Khiếu nại & Báo cáo', icon: () => <MdReportGmailerrorred size={24} /> },
    { id: 'language', label: 'Ngôn ngữ', icon: LanguageIcon },
    { id: 'upgrade', label: 'Nâng cấp tài khoản',  icon: () => <TbArrowBigUpLines size={24} /> },
    { id: 'logout', label: 'Đăng xuất', icon: LogoutIcon }
  ];

  const menuPaths: Record<string, string> = {
    home: '/',
    notifications: '/notifications',
    posts: '/profile',
    transactions: '/transactions',
    delegation: '/delegation',
    profile: '/profile',
    reports: '/reports',
    language: '/language',
    upgrade: '/upgrade',
    logout: '/logout',
  };

  const handleMenuClick = (itemId: string) => {
    setActiveItem(itemId);
    const path = menuPaths[itemId];
    if (path) navigate(path);
  };

  useEffect(() => {
    const foundItem = Object.entries(menuPaths).find(([, path]) => path === location.pathname);
    if (foundItem) setActiveItem(foundItem[0]);
  }, [location.pathname]);

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
                <Icon component={item.icon} className={styles.menuIcon} />
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
