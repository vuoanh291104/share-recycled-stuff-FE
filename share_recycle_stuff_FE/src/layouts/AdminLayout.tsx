import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'

const AdminLayout = () => {
  return (
    <div style={{display: 'flex'}}>
        <Sidebar />
        <main>
            <Outlet />
        </main>
    </div>
    )
}

export default AdminLayout
