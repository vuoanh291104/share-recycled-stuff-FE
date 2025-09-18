import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <>
        <div>AdminLayout</div>
        <main>
            <Outlet></Outlet>
        </main>  
    </>
    )
}

export default AdminLayout
