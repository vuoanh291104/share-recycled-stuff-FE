import { useState, useEffect } from 'react';
import { Modal, Button, Upload, Select } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UserInfo } from '../../types/schema';
import { CloseSquareIcon } from '../icons/CountIcon';
import Icon from '@ant-design/icons';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import styles from './CreationPostModal.module.css';
import { Categories } from '../../constant/Category';
import { PostPurposeValues } from '../../constant/PostPurpose';
import axios from 'axios';
import { useMessage } from '../../context/MessageProvider';
interface CreationPostModalProps {
  user: UserInfo;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    accountId: number;
    title: string;
    content: string;
    price: number;
    categoryId: number;
    purposeCode: number;
    images: { imageUrl: string; displayOrder: number }[];
  }) => void;
}

const CreationPostModal = ({ user, open, onClose, onSubmit }: CreationPostModalProps) => {
  const {showMessage} = useMessage();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<number>(1);
  const [purpose, setPurpose] = useState<number>(1);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const userInfo = localStorage.getItem("userInfo");
  const accountID = userInfo? JSON.parse(userInfo).accountId : null;

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET_POST = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_POST;

  //up từng ảnh 1 lên cloudinary
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

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setContent("");
      setPrice("");
      setCategory(1);
      setPurpose(1);
      setFileList([]);
    }
  }, [open]);

  // Khi người dùng upload ảnh
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Khi nhấn nút "Post"
  const handleSubmit = async () => {

    const uploadedImages : {imageUrl: string, displayOrder: number} [] = []

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.originFileObj) {
          const url = await uploadToCloudinary(file.originFileObj as File);
          uploadedImages.push({ imageUrl: url, displayOrder: i + 1 });
        }
      }

    const payload = {
      accountId: accountID, 
      title,
      content,
      price: parseFloat(price) || 0,
      categoryId: category,
      purposeCode: purpose,
      images: uploadedImages,
    };

    console.log("🚀 Dữ liệu gửi lên BE:", payload);
    onSubmit(payload);
    onClose();
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      width={702}
      centered
      className={styles.modalWrapper}
    >
      <div className={styles.reviewCreation}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <img
              src={user.avatarUrl || "/images/default-avatar.png"}
              alt={user.fullName}
              className={styles.avatar}
            />
            <h3 className={styles.userName}>{user.fullName}</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <CloseSquareIcon />
          </button>
        </div>

        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            placeholder="Tiêu đề:"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
          />
          <textarea
            className={styles.textarea}
            placeholder="Nội dung:"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <textarea
            className={styles.textarea}
            placeholder="Giá:"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            rows={1}
          />

          <div className={styles.selectRow}>
            <Select
              placeholder="Chọn danh mục"
              value={category || undefined}
              onChange={(value) => setCategory(value)}
              className={styles.selectField}
              suffixIcon={<Icon component={ChevronDownIcon} style={{ width: '16px', height: '8px', color: '#292d32' }} />}
              options={Categories.map((cat) => ({
                label: cat.description,
                value: cat.id,
              }))}
            />
            <Select
              placeholder="Chọn mục đích"
              value={purpose || undefined}
              onChange={(value) => setPurpose(value)}
              className={styles.selectField}
              suffixIcon={<Icon component={ChevronDownIcon} style={{ width: '16px', height: '8px', color: '#292d32' }} />}
              options={PostPurposeValues.map((p) => ({
                label: p.description,
                value: p.id,
              }))}
            />
          </div>

          <div className={styles.uploadSection}>
            <div className={styles.uploadLabel}>Ảnh bài đăng</div>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              multiple
            >
              {uploadButton}
            </Upload>
          </div>
        </div>

        <Button
          type="primary"
          className={styles.postButton}
          onClick={handleSubmit}
          size="large"
        >
          Post
        </Button>
      </div>
    </Modal>
  );
};
export default CreationPostModal;
