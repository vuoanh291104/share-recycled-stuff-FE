import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("accessToken");
    const userInfo = localStorage.getItem("userInfo");
    const expiresAt = localStorage.getItem("expiresAt");

    console.log(userInfo)
    const navigate = useNavigate();

  // chưa login
    if (!token || !userInfo || !expiresAt) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userInfo);
    const now = Date.now();

    //check hết hạn
    if (now > parseInt(expiresAt)) {
        console.warn("Token expired");
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    //check xem có quyền ko
    if (!allowedRoles.includes(user.role)) {

        console.warn("Không có quyền truy cập");
        return (
            <div style={{marginLeft:'500px'}}>
                <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
                extra={
                    <Button type="primary" onClick={() => {
                        switch (user.role) {
                        case "ADMIN":
                            navigate("/admin");  //fix sau
                            break;
                        case "CUSTOMER":
                        case "PROXY_SELLER":
                        default:
                            navigate("/");
                            break;
                    }
                    }}>
                    Về trang chủ
                    </Button>
                }
                />
            </div>
        );
    }
    return <Outlet />;
};

export default ProtectedRoute;
