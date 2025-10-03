import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import type { User } from '../types/schema';
import Header from '../components/Header/Header';

type PrivateLayoutProps = {
  currentUser:User;
}

const PrivateLayout = ({currentUser} : PrivateLayoutProps) => {

  return (
    <>
    
        <Sidebar />
        <Header currentUser={currentUser}/>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default PrivateLayout
