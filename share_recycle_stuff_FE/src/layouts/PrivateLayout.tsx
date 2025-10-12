import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import type { User } from '../types/schema';
import Header from '../components/Header/Header';

type PrivateLayoutProps = {
  currentUser: User;
}

const PrivateLayout = ({currentUser} : PrivateLayoutProps) => {

  return (
    <div style={{display: 'flex'}}>
    
        <Sidebar />
        <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default PrivateLayout
