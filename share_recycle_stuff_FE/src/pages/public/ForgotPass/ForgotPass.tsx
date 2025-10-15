import { Form, Input, Button } from 'antd'
import '/src/styles/globalStyle.css';
import styles from './forgot.module.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import forgot from '../../../assets/forgotPass.png'
const ForgotPass = () => {

    const [loading, setLoading] = useState (false);

    const onFinish = (values: any) => {
        console.log('Success:', values);
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
