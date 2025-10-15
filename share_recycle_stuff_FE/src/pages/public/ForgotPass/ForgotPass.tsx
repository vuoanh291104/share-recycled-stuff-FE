import { Form, Input, Button } from 'antd'
import '/src/styles/globalStyle.css';
import styles from './forgot.module.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import forgot from '../../../assets/forgotPass.png'
import { postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import { useMessage } from '../../../context/MessageProvider';
const ForgotPass = () => {
    const {showMessage} = useMessage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState (false);


    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const res = await postData<{message: string}>('/api/auth/forgot-password', values)
            showMessage({ type: 'success', message: res.message });
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error: any) {
            const errData : ErrorResponse = error;
            showMessage({ type: 'error', message: errData.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!' });
        }finally {
            setLoading(false);
        }
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
  return (
    <div className= {styles.container}>
        <div style={{display:'flex', justifyContent:'center'}}>
            <img src={forgot} alt="forgot" className= {styles.banerImage} />
        </div>
        <div className={styles.formContainer}>
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
                    className= {styles.mgb}
                >
                    <Input type='email'/>
                </Form.Item>

                <Form.Item style={{marginInlineStart:0}} >
                    <Button className={styles.btnSend} htmlType="submit"
                            loading = {loading}
                    >
                        Gửi yêu cầu
                    </Button>
                </Form.Item>
                <div className= {styles.backLogin}>
                        <Link  to="/login">Quay lại trang đăng nhập</Link>
                </div>
            </Form>
        </div>
    </div>
  )
}

export default ForgotPass
