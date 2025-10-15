import { Button, Form, Input} from 'antd';
import { LockFilled } from '@ant-design/icons';
import styles from './forgot.module.css'
import '/src/styles/globalStyle.css';
import ResetImage from '/src/assets/resetPass.png'
import { postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import clsx from 'clsx';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from '../../../context/MessageProvider';

interface ResetPassProps {
    message: string,
    code: number
}
const ResetPass = () => {
    const location = useLocation();
    const token = location.state?.token || '';
    const navigate = useNavigate();

    const {showMessage} = useMessage();

    const [loading, setLoading] = useState(false);
  
    const onFinish = async (values: any) => {
        const payload = { ...values, token };
        console.log('Success:', payload);
        setLoading(true);
        try {
            const res = await postData<ResetPassProps> ('/api/auth/reset-password', payload);
            showMessage({ type: "success", message: res.message });
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error : any) {
            const errData : ErrorResponse = error;
            showMessage({ type: "error", message: errData.message, code: errData.status });
        }finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

  return (
    <div className= {styles.container_reset}>
        <div style={{display:'flex', justifyContent:'center'}}>
            <img src={ResetImage} alt="reset"  />
        </div>
        <div className= {clsx(styles.formContainer, styles.formBody) }>
            <div >
                <LockFilled className= {styles.iconLock} />
            </div>
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
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                {
                    required: true,
                    message: 'Nhập mật khẩu mới!',
                },
                ]}
                hasFeedback
                className= {styles.mgb}
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
                className= {styles.mgb}
            >
                <Input.Password />
            </Form.Item>


            <Form.Item style={{marginInlineStart:0}} >
            <Button 
                htmlType="submit"
                className= {styles.btnConfirm}
                loading= {loading}
                >
                Cập nhật
            </Button>
            </Form.Item>
            
        </Form>
        </div>
    </div>
  )
}

export default ResetPass
