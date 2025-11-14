import { Button, Form, Input } from 'antd';
import '/src/styles/GlobalStyle.css';
import styles from './auth.module.css'
import { Link, useNavigate } from 'react-router-dom';
import LoginGG from '../../components/LoginGG/LoginGG';
import clsx from 'clsx';
import { postData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { useState } from 'react';
import { useMessage } from '../../context/MessageProvider';

interface LoginResponse {
  result: {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    userInfo: []
  };
  code: number;
  message: string;
}
const Login = () => {

  const [loading, setLoading] = useState (false); 

  const {showMessage} = useMessage();

  const navigate  = useNavigate();

  

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await postData<LoginResponse>("/api/auth/login", values);
      localStorage.setItem('accessToken', res.result.accessToken);
      window.dispatchEvent(new Event('token-updated'));

      localStorage.setItem('refreshToken', res.result.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify(res.result.userInfo));

      const expiresAt = Date.now() + res.result.expiresIn * 1000;
      localStorage.setItem("expiresAt", expiresAt.toString());

      showMessage({ type: "success", message: res.message });

      const user = JSON.parse(localStorage.getItem('userInfo')!) as { role: string };

      setTimeout(() => {
        switch (user.role) {
          case 'CUSTOMER':
          case 'PROXY_SELLER':
            navigate("/");
            break;
          case 'ADMIN':
            navigate("/admin/accounts");
            break;
          default:
            navigate("/");
        }
      }, 1500);
    } catch (err : any) {
      const errorData: ErrorResponse = err;
      showMessage({
        type: "error",
        message: errorData.message || "Login failed",
        code: errorData.status,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className={styles.text_title}>CHÀO MỪNG TRỞ LẠI</div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical" 
        labelAlign='left'
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Nhập email của bạn!' },
            { type: 'email', message: 'Email không đúng định dạng!' }
          ]}
            
        >
          <Input type='email' />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Nhập mật khẩu của bạn!' }]}
        >
          <Input.Password />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link  to="/forgot">Quên mật khẩu</Link>
        </div>

        <Form.Item style={{marginInlineStart:0}} >
          <Button className={clsx(styles.btnLogin, styles.mgt_16)} htmlType="submit"
                  loading = {loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <LoginGG />
        <div className={styles.mgt_16}>
          <span>Bạn chưa có tài khoản? </span>
          <Link to="/register">Đăng ký</Link>
        </div>
      </Form>
    </>
    
  )
}

export default Login
