import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");

  const user = userInfo ? JSON.parse(userInfo) : null;


  // login rồi + token chưa hết hạn thì cho về home
  if (token && userInfo && expiresAt && Date.now() < parseInt(expiresAt)) {
    switch (user.role) {
        case "CUSTOMER":
        case "PROXY_SELLER":
            return <Navigate to="/" replace />;
        case "ADMIN":
            return <Navigate to="/admin/accounts" replace />;
        default:
            return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
