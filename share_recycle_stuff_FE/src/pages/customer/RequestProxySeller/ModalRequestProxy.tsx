import { Button, Form, Input, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import '/src/styles/GlobalStyle.css';
import styles from './RequestProxy.module.css';
import clsx from 'clsx';


type ModalRequestProxyProps = {
    onFinish?: (values: any) => void;
    onCancel?: () => void;
};

function ModalRequestProxy({ onCancel }: ModalRequestProxyProps) {

  const [form] = Form.useForm();


  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const urls = newFileList
      .map((file) => file.url || (file.response && file.response.url))
      .filter(Boolean);

    form.setFieldsValue({ cccdImages: urls });

  }

  const onFinish = (values: any) => {
    if (!values.cccdImages || values.cccdImages.length < 2) {
      message.error('Bạn phải upload đủ 2 ảnh CCCD!');
      return;
    }
    console.log('Submit form:', values);
    if (onCancel) onCancel();
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

        {/* <Form.Item
          name="cccdImages"
          rules={[{ required: true, message: 'Vui lòng upload ảnh CCCD!' }]}
          hidden
        >
          <Input />
        </Form.Item> */}
         {/*Này ẩn, sau khi Upload & lấy UrlImages từ cloud về thì sẽ set vào Value 
                                  của form để gửi về BE*/}

        <Form.Item
          name="cccdImages"
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
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
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
    </div>
  );
}

export default ModalRequestProxy;
