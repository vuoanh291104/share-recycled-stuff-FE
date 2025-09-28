import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PrivateLayout from '../layouts/PrivateLayout'
import PublicLayout from '../layouts/PublicLayout'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import Home from '../pages/common/Home'
import Profile from '../pages/common/Profile'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import { mockRootProps } from '../data/homeMockData'


const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {path: '/login', element: <Login />},
            {path: '/register', element: <Register />}
        ]
    },
    {
        element: <PrivateLayout />,  //Customer + Proxy_seller use
        children: [
            {path: '/', element: <Home
            currentUser={mockRootProps.currentUser}
            posts={mockRootProps.posts}
          />},
            {path: '/profile', element: <Profile />}
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {path: '/admin',
                children: [
                    {index: true, element: <Dashboard />},
                ]
            }
        ]
    }
])
const Routes = () => <RouterProvider router={router} />


export default Routes
