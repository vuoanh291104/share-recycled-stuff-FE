import { useState } from 'react';
import { Button, Input } from 'antd';
import styles from './CommentInput.module.css';

interface CommentInputProps {
  placeholder?: string;
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}

const CommentInput = ({ 
  placeholder = "Add a comment...", 
  onSubmit, 
  isLoading = false,
  autoFocus = false 
}: CommentInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.commentInput}>
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        autoSize={{ minRows: 1, maxRows: 4 }}
        autoFocus={autoFocus}
        className={styles.textArea}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!content.trim()}
        className={styles.submitButton}
      >
        Post
      </Button>
    </div>
  );
};

export default CommentInput;
