import { useState, useEffect } from 'react';
import { Modal, Button, Upload, Select } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { User, Post } from '../../types/schema';
import { CloseSquareIcon } from '../icons/CountIcon';
import Icon from '@ant-design/icons';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import styles from './CreationPostModal.module.css';
import { PostStatusValues, type PostPurpose, type PostStatus } from '../../types/enums';

interface EditPostModalProps {
  user: User;
  post: Post;
  open: boolean;
  onClose: () => void;
  onSubmit: (postId: number, updatedData: Partial<Post>) => void;
}

const EditPostModal = ({ user, post, open, onClose, onSubmit }: EditPostModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>('');
  const [purpose, setPurpose] = useState<PostPurpose | ''>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initialize form with post data when modal opens
  useEffect(() => {
    if (open && post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setPrice(post.price?.toString() || '');
      setCategory(post.category || '');
      setPurpose(post.purpose || '');
      
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
  const handleSubmit = () => {
    const imageUrls = fileList
      .map((file) => file.thumbUrl || file.url || (file.response && file.response.url))
      .filter(Boolean) as string[];
    
    onSubmit(post.id, {
      title,
      content,
      price: parseFloat(price) || 0,
      category,
      purpose: purpose as PostPurpose,
      images: imageUrls.map((url, idx) => ({
        id: idx + 1,
        imageUrl: url,
        displayOrder: idx
      })),
      updatedAt: new Date().toISOString(),
      status: PostStatusValues.ACTIVE as PostStatus,
    });
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
              src={user.avatar_url}
              alt={user.full_name}
              className={styles.avatar}
            />
            <h3 className={styles.userName}>{user.full_name}</h3>
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
              options={[
                { label: 'Đồ điện tử', value: 'Đồ điện tử' },
                { label: 'Quần áo', value: 'Quần áo' },
                { label: 'Đồ gia dụng', value: 'Đồ gia dụng' },
                { label: 'Sách vở', value: 'Sách vở' },
                { label: 'Đồ chơi', value: 'Đồ chơi' },
                { label: 'Khác', value: 'Khác' }
              ]}
            />
            <Select
              placeholder="Chọn mục đích"
              value={purpose || undefined}
              onChange={(value) => setPurpose(value)}
              className={styles.selectField}
              suffixIcon={<Icon component={ChevronDownIcon} style={{ width: '16px', height: '8px', color: '#292d32' }} />}
              options={[
                { label: 'Cho tặng miễn phí', value: 'Free GiveAway' },
                { label: 'Bán', value: 'For Sale' },
                { label: 'Tin tức/Thông tin', value: 'News/Information' }
              ]}
            />
          </div>

          <div className={styles.uploadSection}>
            <div className={styles.uploadLabel}>Ảnh bài đăng</div>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              multiple
            >
              {fileList.length >= 8 ? null : uploadButton}
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
