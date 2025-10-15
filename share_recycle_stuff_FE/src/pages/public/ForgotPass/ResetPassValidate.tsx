import { Button, Result} from "antd";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullScreenLoading from "../../../components/FullScreenLoading/FullScreenLoading";
import styles from './forgot.module.css'


const ResetPassValidate = () => {

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParam] = useSearchParams();
  const token = searchParam.get("token");
  const hasVerified = useRef(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {

    try {
      const res = await getData<{code: number, message: string}>(
        `/api/auth/reset-password/validate`,
        {token}
      );
      if (res.code === 200) {
        setStatus("success");
        setTimeout(() => {
          navigate('/reset', {state: {token}}); 
        }, 1500);
      }
      else setStatus("error");
    } catch (err: any) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true; // chỉ chạy lần đầu
      verifyEmail();
    } else if (!token) {
      setStatus("error");
      setLoading(false);
    }
  }, [token]);


  if (loading)
    return (
      <FullScreenLoading />
    );

  return (
    <div >
      <div className= {styles.resultVerify} >

        {status === "success" ? (
          <Result
            status="success"
            title="Xác thực yêu cầu thành công!"
            subTitle="Yêu cầu của bạn đã được xác thực. Vui lòng chờ trong giây lát để chuyển đến trang đặt lại mật khẩu."
          />
        ) : (
          <Result
            status="error"
            title="Xác thực thất bại!"
            subTitle="Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng về trang quên mật khẩu và nhập email để nhận lại link mới."
            extra={[
              <Button type="primary" key="forgot" href="/forgot-password">
                Nhập lại email của bạn
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPassValidate;
