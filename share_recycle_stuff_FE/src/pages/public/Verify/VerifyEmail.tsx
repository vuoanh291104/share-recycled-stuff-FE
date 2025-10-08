import { Button, Input, Result, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { getData, postData } from "../../../api/api";
import type { ErrorResponse } from "../../../api/api";
import { useSearchParams } from "react-router-dom";
import { useMessage } from "../../../context/MessageProvider";
import styles from './verify.module.css'



const VerifyEmail = () => {
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [searchParam] = useSearchParams();
  const token = searchParam.get("token");
  const hasVerified = useRef(false);
  
  const {showMessage} = useMessage();

  const verifyEmail = async () => {

    try {
      const res = await getData<{code: number, message: string}>(
        `/api/auth/verify`,
        {token}
      );
      if (res.code === 200) setStatus("success");
      else setStatus("error");
    } catch (err: any) {
      const errorData: ErrorResponse = err;
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

  const reSendEmail = async () => {
    try {
      const res = await postData<{code: number, message: string}>(`/api/auth/resend-verification?email=${email}`, {});
      showMessage({type:"error", message: "Email xác thực tài khoản đã được gửi lại! Vui lòng kiểm tra email của bạn"})
    } catch (err: any) {
      const errorData : ErrorResponse = err
      showMessage({type:"error", message: errorData.message, code: errorData.status})
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin tip="Đang xác thực tài khoản..." />
      </div>
    );

  return (
    <div >
      <div className={styles.verifyContainer}>

        {status === "success" ? (
          <Result
            status="success"
            title="Xác thực tài khoản thành công!"
            subTitle="Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập ngay."
            extra={[
              <Button type="primary" key="login" href="/login">
                Đăng nhập
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title="Xác thực thất bại!"
            subTitle="Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng nhập email để nhận lại link mới."
            extra={[
              <Input
                type="email"
                value={email}
                placeholder="Nhập email của bạn"
                onChange={(e) => setEmail(e.target.value)}
              />,
              <Button
                type="primary"
                key="resend"
                onClick={reSendEmail}
                disabled={!email}
                className= {styles.btnResend}
              >
                Gửi lại link xác thực
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
