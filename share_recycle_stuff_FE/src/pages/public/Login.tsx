import { Button, Form, Input } from 'antd';
import '/src/styles/GlobalStyle.css';
import styles from './auth.module.css'
import { Link } from 'react-router-dom';
import LoginGG from '../../components/LoginGG/LoginGG';
import clsx from 'clsx';

const Login = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
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
          <Link  to="">Quên mật khẩu</Link>
        </div>

        <Form.Item style={{marginInlineStart:0}} >
          <Button className={clsx(styles.btnLogin, styles.mgt_16)} htmlType="submit">
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
