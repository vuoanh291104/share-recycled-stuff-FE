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
import ForgotPass from '../pages/public/ForgotPass/ForgotPass'
import ResetPass from '../pages/public/ForgotPass/ResetPass'
import ResetPassValidate from '../pages/public/ForgotPass/ResetPassValidate'
import SendDelegationRequest from '../pages/customer/DelegationRequest/SendDelegationRequest'
import ViewDelegationRequest from '../pages/customer/DelegationRequest/ViewDelegationRequest'
import DelegationRequestManagement from '../pages/proxy_seller/DelegationRequestManagement/DelegationRequestManagement'

const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                element: <PublicLayout />,
                children: [
                    {path: '/login', element: <Login />},
                    {path: '/register', element: <Register />},
                    {path: '/verify', element: <VerifyEmail />},
                    {path: '/forgot', element: <ForgotPass />},
                    {path: '/reset-password', element: <ResetPassValidate />},
                    {path: '/reset', element: <ResetPass />}
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
                    { 
                        path: '/delegations', 
                        element: <ViewDelegationRequest />,
                        children: [
                            {path: 'new', element: <SendDelegationRequest />},
                        ]
                    },
                    { 
                        path: '/managedelegations', 
                        element: <DelegationRequestManagement />,
                        children: [
                            
                        ]
                    }
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
])
const Routes = () => <RouterProvider router={router} />


export default Routes
