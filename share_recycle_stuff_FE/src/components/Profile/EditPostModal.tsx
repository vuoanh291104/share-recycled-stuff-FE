import { useState, useEffect } from 'react';
import { Modal, Button, Upload, Select } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { User, Post, UserInfo } from '../../types/schema';
import { CloseSquareIcon } from '../icons/CountIcon';
import Icon from '@ant-design/icons';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import styles from './CreationPostModal.module.css';
import { PostStatusValues, type PostPurpose, type PostStatus } from '../../types/enums';
import { Categories } from '../../constant/Category';
import { PostPurposeValues } from '../../constant/PostPurpose';
import axios from 'axios';
import { useMessage } from '../../context/MessageProvider';

interface EditPostModalProps {
  user: UserInfo;
  post: Post;
  open: boolean;
  onClose: () => void;
  onSubmit: (postId: number, updatedData: any) => void;
}

const EditPostModal = ({ user, post, open, onClose, onSubmit }: EditPostModalProps) => {
  const {showMessage} = useMessage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [purposeCode, setPurposeCode] = useState<number | undefined>(undefined);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  // Initialize form with post data when modal opens
  useEffect(() => {
    if (open && post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setPrice(post.price?.toString() || '');

      const category = Categories.find((c) => c.description === post.category);
      setCategoryId(category?.id);

      const purpose = PostPurposeValues.find((p) => p.description === post.purpose);
      setPurposeCode(purpose?.id);

      // Convert PostImageResponse to UploadFile format
      const initialFileList: UploadFile[] = (post.images || []).map((img) => ({
        uid: `${img.id}`,
        name: `image-${img.id}`,
        status: 'done' as const,
        url: img.imageUrl
      }));
      setFileList(initialFileList);
    }
  }, [open, post]);

  // Khi người dùng upload ảnh
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Khi nhấn nút "Cập nhật"
  // const handleSubmit = () => {
  //   const imageUrls = fileList
  //     .map((file) => file.thumbUrl || file.url || (file.response && file.response.url))
  //     .filter(Boolean) as string[];
    
  //     const selectedCategory = Categories.find((c) => c.id === categoryId);
  //     const selectedPurpose = PostPurposeValues.find((p) => p.id === purposeCode);
  //   onSubmit(post.id, {
  //     title,
  //     content,
  //     price: parseFloat(price) || 0,
  //     category: selectedCategory!, // thêm "!" nếu chắc chắn có giá trị
  //     purpose: selectedPurpose!,
  //     images: imageUrls.map((url, idx) => ({
  //       id: idx + 1,
  //       imageUrl: url,
  //       displayOrder: idx
  //     })),
  //     updatedAt: new Date().toISOString(),
  //     status: PostStatusValues.ACTIVE as PostStatus,
  //   });
  //   onClose();
  // };

  const handleSubmit = async () => {
    if (!categoryId || !purposeCode) {
      showMessage({ type: 'error', message: 'Vui lòng chọn danh mục và mục đích!' });
      return;
    }

    try {
      // Xử lý ảnh: giữ id cũ, upload mới
      const uploadedImages = await Promise.all(
        fileList.map(async (file) => {
          if (file.url) {
            // Ảnh cũ
            return {
              id: file.uid ? parseInt(file.uid) : undefined,
              imageUrl: file.url,
            };
          } else if (file.originFileObj) {
            // Ảnh mới upload
            const uploadedUrl = await uploadToCloudinary(file.originFileObj as File);
            return { imageUrl: uploadedUrl };
          }
          return null;
        })
      );

      const imagesForBE = uploadedImages
        .filter(Boolean)
        .map((img, idx) => ({
          id: img?.id,
          imageUrl: img!.imageUrl,
          displayOrder: idx,
        }));

      onSubmit(post.id, {
        title,
        content,
        price: parseFloat(price) || 0,
        categoryId,
        purposeCode,
        images: imagesForBE,
      });

      onClose();
    } catch (error) {
      console.error('Upload hình ảnh thất bại', error);
    }
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
              value={categoryId || undefined}
              onChange={(value) => setCategoryId(value)}
              className={styles.selectField}
              suffixIcon={<Icon component={ChevronDownIcon} style={{ width: '16px', height: '8px', color: '#292d32' }} />}
              options={Categories.map((cat) => ({
                label: cat.description,
                value: cat.id,
              }))}
            />
            <Select
              placeholder="Chọn mục đích"
              value={purposeCode || undefined}
              onChange={(value) => setPurposeCode(value)}
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
              multiple
              beforeUpload={() => false}
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
          Cập nhật
        </Button>
      </div>
    </Modal>
  );
};
export default EditPostModal;
