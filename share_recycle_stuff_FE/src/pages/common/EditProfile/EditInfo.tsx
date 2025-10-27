import { Button, Form, Input, message, Upload } from 'antd';

import AddressSelect from '../../../components/AddressSelect/AddressSelect';
import styles from './EditProfile.module.css'
import { useEffect, useState } from 'react';
import type { ProfileInfo } from '../../../types/schema';
import { getData, putData } from '../../../api/api';
import axios from 'axios';
import { useMessage } from '../../../context/MessageProvider';

interface DataResponse {
  code: number,
  message: string,
  result: ProfileInfo
}

const EditInfo = () => {
    const {showMessage} = useMessage();

    const [profileInfo, setProfileInfo] = useState<ProfileInfo | null> (null);

    const getProfileInfo = async () => {
        const url = '/api/profile/me';
        try {
          const res = await getData<DataResponse> (url);
          setProfileInfo(res.result);
        } catch (error: any) {
          console.error('data error');
        }
      }
    
    useEffect(()=> {
        getProfileInfo();
    },[])

    const [form] = Form.useForm();

    const [imageUrl, setImageUrl] = useState(profileInfo?.avatarUrl);

    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);


    useEffect(() => {
        if (profileInfo) {
            setImageUrl (profileInfo.avatarUrl);

            form.setFieldsValue({
                fullName: profileInfo.fullName,
                phoneNumber: profileInfo.phoneNumber,
                city: profileInfo.city,
                ward: profileInfo.ward,
                address: profileInfo.address,
                bio: profileInfo.bio,
                avatarUrl: profileInfo.avatarUrl,
            });
        }
    }, [profileInfo, form]);

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET_POST = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_AVATAR;

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        setUpdating(true);
        try {
            const res = await putData('/api/profile/me', values);
            const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUser = {
                ...storedUser,
                fullName: values.fullName,
                avatarUrl: form.getFieldValue('avatarUrl') || imageUrl, 
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            showMessage({type:"success", message: "Cập nhật thành công!"})
        } catch (error: any) {
            showMessage({type:"error", message: "Cập nhật thất bại! Vui lòng thử lại"})
        } finally {
            setUpdating(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const uploadToCloudinary = async (file : File) : Promise<string> => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET_POST);

        try {
        const res = await axios.post(url, formData, 
            {
            headers: {'Content-Type': 'multipart/form-data'}
            }
        )

        if(res.data.secure_url) return res.data.secure_url;
            throw new Error('Upload thất bại');
        } catch (error: any) {
            showMessage({type:"error", message:"Up load thất bại"})
            throw error;
        }
    }

    const handleChange = async (info: any) => {
        const file = info.file.originFileObj as File;
        if (!file) return;

        try {
            setUploading(true);
            const url = await uploadToCloudinary(file); 
            setImageUrl(url); 
            form.setFieldValue('avatarUrl', url); 
            showMessage({ type: 'success', message: 'Tải ảnh thành công! Hãy cập nhật để thông tin được lưu lại' });
        } catch (error) {
            showMessage({ type: 'error', message: 'Tải ảnh thất bại! Hãy thử lại' });
        } finally {
            setUploading(false);
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
                    <div>{profileInfo?.fullName}</div>
                    </div>

                    <Upload
                        showUploadList={false}
                        customRequest={() => {}} 
                        beforeUpload={async (file) => {
                            await handleChange({ file: { originFileObj: file } });
                            return false; 
                        }}
                        accept="image/*"
                        >
                        <Button loading={uploading}>Change Photo</Button>
                    </Upload>
                </div>
            </Form.Item>
            <Form.Item name="avatarUrl" hidden>
                <Input type="hidden" />
            </Form.Item>

            <Form.Item
            label="Họ và tên"
            name="fullName"
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
                    loading = {updating}
                >Cập nhật </Button>
            </Form.Item>
        </Form>
        </div>
  )
}

export default EditInfo
