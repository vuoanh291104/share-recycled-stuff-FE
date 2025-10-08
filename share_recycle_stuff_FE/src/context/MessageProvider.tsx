import React, { createContext, useContext, useState , useRef, useEffect } from "react";
import type {ReactNode} from 'react';
import MessageModal from "../components/NotiMessage/MessageModal";

type MessageType = "success" | "error";

interface MessageContextType {
  showMessage: (options: { type: MessageType; message: string; code?: number }) => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const useMessage = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessage must be used within MessageProvider");
  return ctx;
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [modalData, setModalData] = useState<{
    type: MessageType;
    message: string;
    code?: number;
    open: boolean;
  }>({ type: "success", message: "", open: false });

  // useRef : lưu id của timeout hiện tại
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = ({ type, message, code }: { type: MessageType; message: string; code?: number }) => {
    // clear timeout cũ => tránh bị đóng modal sớm
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setModalData({ type, message, code, open: true });

    // tạo timeout mới
    timeoutRef.current = setTimeout(() => {
      setModalData((prev) => ({ ...prev, open: false }));
      timeoutRef.current = null; // reset ref
    }, 2000);
  };

  // clear timeout khi component unmount (tránh memory leak)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      <MessageModal
        type={modalData.type}
        message={modalData.message}
        code={modalData.code}
        open={modalData.open}
        onOk={() => setModalData((prev) => ({ ...prev, open: false }))}
      />
    </MessageContext.Provider>
  );
};
