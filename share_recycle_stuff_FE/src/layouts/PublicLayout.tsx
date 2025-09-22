import { Outlet, useLocation } from 'react-router-dom'
import Auth from '../pages/public/Auth'

const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      <main>
        {isAuthPage ? <Auth /> : <Outlet />}
      </main>
    </>
  )
}

export default PublicLayout
