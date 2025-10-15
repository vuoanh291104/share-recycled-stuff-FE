import { Button, Form, Input } from 'antd';
import styles from './EditProfile.module.css'
import { useState } from 'react';
import { postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import { useMessage } from '../../../context/MessageProvider';
import { useNavigate } from 'react-router-dom';

interface ChangePassProps {
    message: string,
    code: number
}

const ChangePass = () => {

    const navigate = useNavigate();
    const {showMessage} = useMessage();

    const [loading, setLoading] = useState(false);
  
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
          const res = await postData<ChangePassProps> ('api/auth/change-password', values);
          showMessage ({type: "success", message: res.message});

          // Gọi xong nhớ logout
          setTimeout(() => {
            navigate('/login')
          }, 1000)
        } catch (error : any) {
          const errData : ErrorResponse = error;
          showMessage({ type: "error", message: errData.message|| 'Đã có lỗi xảy ra, vui lòng thử lại sau!', code: errData.status });
        } finally {
          setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
  return (
    <div>
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
          label="Mật khẩu"
          name="currentPassword"
          rules={[{ required: true, message: 'Nhập mật khẩu hiện tại của bạn!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          {
            required: true,
            message: 'Nhập mật khẩu mới!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Xác nhận lại mật khẩu!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Không khớp với mật khẩu mới!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>


        <Form.Item style={{marginInlineStart:0}} >
          <Button 
            htmlType="submit"
            className= {styles.update}
            loading= {loading}
            >
            Cập nhật
          </Button>
        </Form.Item>
        
      </Form>
    </div>
  )
}

export default ChangePass
