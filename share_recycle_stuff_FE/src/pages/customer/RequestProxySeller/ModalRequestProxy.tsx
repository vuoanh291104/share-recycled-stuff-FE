import { Button, Form, Input, Upload, message, Spin } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import '/src/styles/GlobalStyle.css';
import styles from './RequestProxy.module.css';
import { postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import clsx from 'clsx';
import axios from 'axios';
import { useMessage } from '../../../context/MessageProvider';
import FullScreenLoading from '../../../components/FullScreenLoading/FullScreenLoading';


type ModalRequestProxyProps = {
    onFinish?: (values: any) => void;
    onCancel?: () => void;
};

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET_UPGRADE = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_UPGRADE;

function ModalRequestProxy({ onCancel }: ModalRequestProxyProps) {

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const {showMessage} = useMessage();

  //method để upload từng ảnh 1 lên trên cloud
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET_UPGRADE);

    try {
      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.secure_url) return res.data.secure_url;

      throw new Error('Upload thất bại');
    } catch (error: any) {
      showMessage({type:"error", message:"Up load thất bại"})
      throw error;
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    form.setFieldsValue({ cccdImages: newFileList });
    form.validateFields(['cccdImages']).catch(() => {}); // validate theo form
  }

  const onFinish = async (values: any) => {
    if (!values.cccdImages || values.cccdImages.length < 2) {
      message.error('Bạn phải upload đủ 2 ảnh CCCD!');
      return;
    }

    try {
      setLoading(true);

      const uploadedUrls = await Promise.all(
        fileList.map(async (file) => {
          const originFile = file.originFileObj as File;
          return await uploadToCloudinary(originFile);
        })
      );

      const [frontImage, backImage] = uploadedUrls;

      const payload = {
        idCard: values.cccdID,
        addressDetail: values.address,
        idCardFrontImage: frontImage,
        idCardBackImage: backImage,
      };

      console.log('Gửi lên BE:', payload);

      await postData('/api/upgrade-request', payload); 
      showMessage({type:"success", message: "Gửi yêu cầu thành công"})

      if (onCancel) onCancel();

    } catch (err: any) {

        const errData : ErrorResponse = err;
        showMessage({type: "error", message: errData.message, code: errData.status});

    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        labelAlign="left"
      >
        <Form.Item
          label="Số CCCD"
          name="cccdID"
          rules={[{ required: true, message: 'Nhập số cccd của bạn!' }]}
        >
          <Input type="text" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ chi tiết"
          name="address"
          rules={[{ required: true, message: 'Nhập địa chỉ của bạn!' }]}
        >
          <Input type="text" placeholder="Số nhà, tên đường" />
        </Form.Item>

        <Form.Item
          name="cccdImages"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            // lấy event object ra 
            if (Array.isArray(e)) return e;
            return e?.fileList || [];
          }}
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value || value.length < 2) {
                  return Promise.reject("Vui lòng upload đủ 2 ảnh CCCD!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <div className="image">
              
            <div className={styles.text}>Ảnh CCCD mặt trước và mặt sau</div>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 2 ? null : uploadButton}
            </Upload>
          </div>
        </Form.Item>

        <Form.Item>
            <div className={styles.modal_buttons}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className= {clsx(styles.btn_general, styles.btn_submit)}>
                    Xác nhận
                </Button>

                <Button htmlType="button" onClick={onCancel} className={styles.btn_general}>Hủy</Button>
            </div>
        </Form.Item>

      </Form>
      {loading && <FullScreenLoading />}
    </div>
  );
}

export default ModalRequestProxy;
