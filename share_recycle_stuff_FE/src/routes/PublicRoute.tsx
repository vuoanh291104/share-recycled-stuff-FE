import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");

  // login rồi + token chưa hết hạn thì cho về home
  if (token && userInfo && expiresAt && Date.now() < parseInt(expiresAt)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
