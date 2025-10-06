import { Button, Form, Input } from 'antd';
import styles from './EditProfile.module.css'
import { useState } from 'react';

const ChangePass = () => {

    const [loading, setLoading] = useState(false);
  
    const onFinish = (values: any) => {
        console.log('Success:', values);
        setLoading(true);
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
          name="oldPassword"
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
        name="confirm"
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
