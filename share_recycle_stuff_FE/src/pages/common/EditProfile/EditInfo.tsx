import { Button, Form, Input, message, Upload } from 'antd';

import AddressSelect from '../../../components/AddressSelect/AddressSelect';
import styles from './EditProfile.module.css'
import { useState } from 'react';

const EditInfo = () => {
    const [form] = Form.useForm();


    const [imageUrl, setImageUrl] = useState("https://i.pinimg.com/564x/dd/2d/0a/dd2d0a59ad7e79453110b2968af72d89.jpg");

    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        setLoading(true);
        try {
        // giả lập gọi api
            await new Promise(resolve => setTimeout(resolve, 2000));

            message.success('Cập nhật thông tin thành công!');
        } catch (error) {
            message.error('Đã có lỗi xảy ra!');
        } finally {
            setLoading(false); //load xong thì tắt
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      const file = info.file.originFileObj;
      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
    }
  };
    return (
        <div>
            <Form
            form={form}
            name="editProfile"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical" 
            labelAlign='left'
        >
            <Form.Item>
                <div className={styles.changePhoto}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <img
                        src={imageUrl}
                        alt="avatar"
                        className={styles.img}
                    />
                    <div>name</div>
                    </div>

                    <Upload
                    showUploadList={false}
                    beforeUpload={() => false} // không upload lên server
                    onChange={handleChange}
                    accept="image/*"
                    >
                    <Button >Change Photo</Button>
                    </Upload>
                </div>
            </Form.Item>
            <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
                { required: true, message: 'Nhập tên của bạn!' }
            ]}
            >
            <Input />
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

            <Form.Item 
            label="Địa chỉ"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '100px'
            }}
            >
            <AddressSelect />
            </Form.Item>
            
            
            <Form.Item
            label="Số nhà/ thôn/ xóm"
            name="address"
            >
            <Input/>
            </Form.Item>
            

            <Form.Item
                label="Bio"
                name="bio"
            >
            <Input.TextArea 
                rows={4} 
                placeholder="Nhập mô tả về bản thân..."
                style={{ resize: 'none', height: '120px' }} 
            />
            </Form.Item>
            
            
            <Form.Item>
                <Button 
                    className= {styles.update}
                    htmlType="submit"
                    loading = {loading}
                >Cập nhật </Button>
            </Form.Item>
        </Form>
        </div>
  )
}

export default EditInfo
