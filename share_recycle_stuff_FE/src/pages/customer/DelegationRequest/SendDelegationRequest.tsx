import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Select, InputNumber } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined, SnippetsFilled } from '@ant-design/icons';
import FullScreenLoading from "../../../components/FullScreenLoading/FullScreenLoading";
import { useMessage } from "../../../context/MessageProvider";
import axios from "axios";
import styles from './DelegationRequest.module.css'
import AddressSelect from "../../../components/AddressSelect/AddressSelect";
import { postData } from "../../../api/api";
import type { ErrorResponse } from "../../../api/api";
import { code } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

interface SendDelegationRequestProps {
    message: string;
    code: number;
}

const SendDelegationRequest = () => {
    
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET_DELEGATION = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_DELEGATION;

    const {showMessage} = useMessage();

    const [loading, setLoading] = useState(false);
    const [listProxy, setListProxy] = useState([ {value : 2, label : "Nguyễn Văn A"}]);
    const [selectedProxy, setSelectedProxy] = useState(null);

    const navigate = useNavigate();
    const [form] = Form.useForm();

    //Phần form
    const onFinish = async (values: any) => {
        setLoading(true);

        const uploadedUrls = await Promise.all(
            fileList.map(async (file) => {
            const originFile = file.originFileObj as File;
            return await uploadToCloudinary(originFile);
            })
        );

        if(selectedProxy === null) {
            showMessage({type:"error", message: "Hãy chọn người bán ủy thác!"})
            setLoading(false);
            return;
        }

        const payload = {...values, imageUrls: uploadedUrls, proxySellerId: selectedProxy};

        try {
            const res = await postData<SendDelegationRequestProps>('/api/delegation-requests', payload);
            showMessage({type:"success", message: res.message})
            navigate('/delegations');
        } catch (error: any) {
            const errData : ErrorResponse = error;
            showMessage({type:"error", message: errData.message || "Gửi yêu cầu thất bại", code: errData.status });
        } finally {
            setLoading(false);
        }
        console.log('Success:', payload);
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

    const onCancel = () => {
        form.resetFields();
        navigate('/delegations');
    }

    //Phần proxy

    const onChangeProxy = (value: any) => {
        setSelectedProxy(value);
        console.log(selectedProxy);
    };

    useEffect(() => {
        if (selectedProxy !== null) {
            console.log("Selected proxy changed:", selectedProxy);
        }
    }, [selectedProxy]);

    useEffect(() => {   //call api lấy danh sách proxy seller
    
    })       

    const onSearch = (value: any) => {
        console.log('search:', value);
    };

    const onFilter = (value : any ) => {       //lọc proxy theo địa chỉ
        console.log('filter:', value);
    }

    
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    //method để upload từng ảnh 1 lên trên cloud
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET_DELEGATION);

        try {
            const res = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.secure_url) return res.data.secure_url;

            throw new Error('Upload thất bại');
        } catch (error: any) {
            showMessage({type:"error", message:"Up load thất bại"})
            setLoading(false);
            throw error;
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

  return (
    <div className= {styles.container}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
            <SnippetsFilled  style={{fontSize: '30px'}}/>
            <h2>Gửi yêu cầu ủy thác</h2>
        </div>
        <div className={styles.proxyContainer}>
            <div>
                <Select
                    showSearch
                    placeholder="Chọn người bán ủy thác"
                    optionFilterProp="label"
                    onChange={onChangeProxy}
                    onSearch={onSearch}
                    options={listProxy}
                />
            </div>
            <div>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFilter}
                    autoComplete="off"
                    layout="inline" 
                    labelAlign='left'
                >
                    <Form.Item>
                        <AddressSelect />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button htmlType="submit" className= {styles.btnFindProxy}>Tìm</Button> {/*call api lọc proxy theo tp , xã*/}
            
                    </Form.Item>
                </Form>
            </div>
        </div>
        <div className = "form">
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
                    label="Mô tả sản phẩm"
                    name="productDescription"
                    rules={[{ required: true, message: 'Hãy nhập mô tả của bạn!' }]}
                >
                    <Input.TextArea rows={5} placeholder="Nhập mô tả..."/>
                </Form.Item>

                <Form.Item
                    label="Giá mong muốn"
                    name="expectPrice"
                    rules={[
                        {
                        required: true,
                        message: "Vui lòng nhập giá mong muốn!",
                        },
                        {
                        type: "number",
                        min: 1,
                        message: "Giá phải là số nguyên dương!",
                        },
                    ]}
                >
                <InputNumber
                    min={1}
                    step={1}
                    style={{ width: "100%" }}
                    placeholder="Nhập giá (VNĐ)"
                />
                </Form.Item>


                <Form.Item
                    label="Số tài khoản"
                    name="bankAccountNumber"
                    rules={[{ required: true, message: 'Nhập số tài khoản ngân hàng của bạn!' }]}
                >
                    <Input type="text"  />
                </Form.Item>

                <Form.Item
                    label="Tên ngân hàng"
                    name="bankName"
                    rules={[{ required: true, message: 'Nhập tên ngân hàng!' }]}
                >
                    <Input type="text"  />
                </Form.Item>

                <Form.Item
                    label="Chủ tài khoản"
                    name="accountHolderName"
                    rules={[{ required: true, message: 'Nhập tên chủ tài khoản!' }]}
                >
                    <Input type="text"  />
                </Form.Item>

                <div >
                    
                <div className= {styles.mgb16}>Hình ảnh sản phẩm</div>
                    <Upload
                    className= {styles.mgb16}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    multiple
                    >
                    {uploadButton}
                    </Upload>
                </div>
                
                <Form.Item>
                    <div className= {styles.btnContainer}>
                        <Button className= {styles.btnCanel} htmlType="button" onClick={onCancel}>Hủy</Button>

                        <Button 
                        className= {styles.btnSend}
                        htmlType="submit" >
                            Gửi yêu cầu
                        </Button>

                        
                    </div>
                </Form.Item>

            </Form>
            {loading && <FullScreenLoading />}
        </div>
    </div>
  )
}

export default SendDelegationRequest
