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
  path?: string;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');

  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo? JSON.parse(userInfo) : null;
  const role = user?.role ?? null; 

  const commonItems: MenuItem [] = [
    { id: 'logout', label: 'Đăng xuất', icon: LogoutIcon },
  ]

  const roleItems : Record <string, MenuItem []> = {
    ADMIN: [
      { id: 'notificationsMana', label: 'Thông báo', icon: () => <MdNotifications size={24} />, path: '/admin/notifications' },
      { id: 'accountMana', label: 'Quản lí tài khoản', icon: () => <MdTextSnippet size={24} />, path: '/admin/accounts' },
      { id: 'postsMana', label: 'Kiểm duyệt bài đăng', icon: () => <MdTextSnippet size={24} />, path: '/admin/posts' },
      { id: 'reportsMana', label: 'Quản lí khiếu nại', icon: () => <MdReportGmailerrorred size={24} />, path: '/admin/reports' },
      { id: 'statisticalMana', label: 'Báo cáo & thống kê', icon: () => <MdCurrencyExchange size={24} />, path: '/admin/statisticals' },
      { id: 'revenueMana', label: 'Quản lý doanh thu', icon: () => <MdHandshake size={24} />, path: '/admin/revenues' },
      { id: 'upgradeMana', label: 'Yêu cầu nâng cấp',  icon: () => <TbArrowBigUpLines size={24} />, path: '/admin/upgradeRequests' },
      { id: 'language', label: 'Ngôn ngữ', icon: LanguageIcon, path: '/language' },

    ],
    CUSTOMER: [
      { id: 'home', label: 'Trang chủ', icon: HomeIcon, path: '/' },
      { id: 'notifications', label: 'Thông báo', icon: () => <MdNotifications size={24} />, path: '/notifications' },
      //{ id: 'posts', label: 'Quản lí bài đăng', icon: () => <MdTextSnippet size={24} />, path: '/posts' },
      //{ id: 'transactions', label: 'Quản lí giao dịch', icon: () => <MdCurrencyExchange size={24} />, path: '/transactions' },
      { id: 'delegation', label: 'Ủy thác', icon: () => <MdHandshake size={24} />, path: '/delegations' },
      { id: 'profile', label: 'Profile', icon: () => <MdAccountBox size={24} />, path: '/profile' },
      { id: 'reports', label: 'Khiếu nại & Báo cáo', icon: () => <MdReportGmailerrorred size={24} />, path: '/reports' },
      { id: 'language', label: 'Ngôn ngữ', icon: LanguageIcon, path: '/language' },
      { id: 'upgrade', label: 'Nâng cấp tài khoản',  icon: () => <TbArrowBigUpLines size={24} />, path: '/upgrade' },
    ],

    PROXY_SELLER: [
      { id: 'home', label: 'Trang chủ', icon: HomeIcon, path: '/' },
      { id: 'notifications', label: 'Thông báo', icon: () => <MdNotifications size={24} />, path: '/notifications' },
      { id: 'delegation', label: 'Quản lí ủy thác', icon: () => <MdHandshake size={24} />, path: '/managedelegations' },
      { id: 'profile', label: 'Profile', icon: () => <MdAccountBox size={24} />, path: '/profile' },
      { id: 'reports', label: 'Khiếu nại & Báo cáo', icon: () => <MdReportGmailerrorred size={24} />, path: 'proxy/reports' },
      { id: 'paid', label: 'Thanh toán', icon: () => <MdCurrencyExchange size={24} />, path: 'proxy/paid' },
      { id: 'language', label: 'Ngôn ngữ', icon: LanguageIcon, path: '/language' },
    ]
  }

  const menuItems = [...(roleItems[role] ?? []), ...commonItems];

  const menuPaths: Record<string, string> = {};
    menuItems.forEach(item => {
      if (item.path) menuPaths[item.id] = item.path;
  });

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'logout') {
      if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
      return;
    }

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
