import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PrivateLayout from '../layouts/PrivateLayout'
import PublicLayout from '../layouts/PublicLayout'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import Home from '../pages/common/Home'
import Profile from '../pages/common/Profile'
import AdminLayout from '../layouts/AdminLayout'
import RequestProxySeller from '../pages/customer/RequestProxySeller/RequestProxySeller'
import { mockRootProps } from '../data/homeMockData'
import EditProfile from '../pages/common/EditProfile/EditProfile'
import VerifyEmail from '../pages/public/Verify/VerifyEmail'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import RequestUpgradeManagement from '../pages/admin/RequestUpgradeManagement/RequestUpgradeManagement'


const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                element: <PublicLayout />,
                children: [
                    {path: '/login', element: <Login />},
                    {path: '/register', element: <Register />},
                    {path: '/verify', element: <VerifyEmail />}
                ]
            }
        ]
    },
    
    {
        element: <ProtectedRoute allowedRoles={['CUSTOMER', 'PROXY_SELLER']} />,
        children: [
            {
                element: <PrivateLayout currentUser={mockRootProps.currentUser} />,
                children: [
                    {
                        path: '/',
                        element: (
                        <Home
                            currentUser={mockRootProps.currentUser}
                            posts={mockRootProps.posts}
                        />
                        ),
                    },

                    {
                        path: '/profile',
                        element: <Profile />,
                        children: [
                            { path: '', element: <Profile /> }, // profile của mk
                            { path: ':userId', element: <Profile /> }, // profile của ng khác
                            { path: 'edit', element: <EditProfile /> },
                        ],
                    },
                    
                    { path: '/upgrade', element: <RequestProxySeller /> },
                ],
            },
        ],
    },
    
    {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: '/admin/upgradeRequests',
                        children: [{ index: true, element: <RequestUpgradeManagement /> }],
                    },
                ],
            },
        ],
    },

    // {
    //     element: <AdminLayout />,
    //             children: [
    //                 {
    //                     path: '/admin',
    //                     children: [{ index: true, element: <RequestUpgradeManagement /> }],
    //                 },
    //             ],
    // }
])
const Routes = () => <RouterProvider router={router} />


export default Routes
