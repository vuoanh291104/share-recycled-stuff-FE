import { Button, Form, Input, Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import '/src/styles/GlobalStyle.css';
import styles from './auth.module.css'
import { Link, useNavigate } from 'react-router-dom';
import LoginGG from '../../components/LoginGG/LoginGG';
import clsx from "clsx";
import AddressSelect from '../../components/AddressSelect/AddressSelect';
import { useState } from 'react';
import {postData} from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { useMessage } from '../../context/MessageProvider';

interface RegisterResponse {
  result: {
    email: string;
  };
  code: number;
  message: string;
}
const Register = () => {
  const {showMessage} =  useMessage();
  const [isAccepted, setIsAccepted] =  useState(false);

  const [loading, setLoading] = useState (false); 

  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    
    const { confirm, ...dataToSend } = values;

    setLoading(true);
    try {
      const res = await postData<RegisterResponse>("/api/auth/register", dataToSend);
      showMessage({type: "success", message: res.message });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const errorData: ErrorResponse = err;
      showMessage({
        type: "error",
        message: errorData.message,
        code: errorData.status
      })
    } finally {
      setLoading (false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onChange: CheckboxProps['onChange'] = (e) => {
    setIsAccepted(e.target.checked);
  };

  return (
    <>
      <div className={styles.text_title}>ĐĂNG KÝ TÀI KHOẢN</div>
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
          label="Tên"
          name="fullName"
          rules={[
            { required: true, message: 'Nhập tên của bạn!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Nhập email của bạn' },
            { type: 'email', message: 'Email không đúng định dạng!' }
          ]}
            
        >
          <Input type='email' />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Nhập số điện thoại của bạn!' },
            {
              pattern: /^(0[3|5|7|8|9])[0-9]{8}$/,
              message: 'Số điện thoại không hợp lệ!'
            }
          ]}
        >
          <Input type='tel' maxLength={10}/>
        </Form.Item>

        <Form.Item label="Địa chỉ">
          <AddressSelect />
        </Form.Item>
          
        
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Nhập mật khẩu của bạn!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Xác nhận lại mật khẩu!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Không khớp với mật khẩu !'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div >
          <Checkbox onChange={onChange}>
            <span>Chấp nhận</span>
            <Link to="#"> Chính sách và điều khoản cộng đồng</Link>
          </Checkbox>
          
        </div>
        
        <Form.Item style={{marginInlineStart:0}} >
          <Button className={clsx(styles.btnLogin, styles.mgt_16)}  
            htmlType="submit"
            disabled={!isAccepted}
            loading = {loading}>
            Đăng ký
          </Button>
        </Form.Item>
        <LoginGG />
        <div className={styles.mgt_16}>
          <span>Bạn đã có tài khoản? </span>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </Form>
      
    </>
  )
}

export default Register
