import { Modal } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface MessageModalProps {
  type: "success" | "error";
  message: string;
  code?: number;
  open: boolean;
  onOk: () => void;
}

const MessageModal = ({type, message, code, open, onOk } : MessageModalProps) => {
  const isSuccess = type === "success";
  const icon = isSuccess ? (
    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 40 }} />
  ) : (
    <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 40 }} />
  );

  return (
    <Modal
      centered
      open={open}
      onOk={onOk}
      closable={true}
      onCancel={onOk}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div style={{ textAlign: "center", paddingTop: 10 }}>
        {icon}
        <p style={{ marginTop: 15, fontSize: 16 }}>{message}</p>
        {!isSuccess && code && (
          <p style={{ color: "#999", fontSize: 14 }}>
            Mã lỗi: <strong>{code}</strong>
          </p>
        )}
      </div>
    </Modal>
  )
}

export default MessageModal
