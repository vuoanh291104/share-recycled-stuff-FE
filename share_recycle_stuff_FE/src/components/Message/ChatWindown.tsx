//Bao gồm MessageList
import { Input } from 'antd'
import {SendOutlined} from '@ant-design/icons'
import styles from './Message.module.css'
import MessageList from './MessageList'
import { useState } from 'react'
import { useMessageChat } from '../../context/MessageChatContext'

interface ChatWindownProp {
  receiverId : number
}

const ChatWindown = ({receiverId} : ChatWindownProp) => {
  const [content, setContent] = useState('');
  const {sendMessage} = useMessageChat();
  
  const SendIb = () => {
    if (!content.trim()) return; 

    sendMessage(receiverId, content.trim());
    setContent(''); 
  };
  
  return (
    <div>
      <div>
        <MessageList recipientId={receiverId} />
      </div>
      <div className= {styles.input_box}>
        <div className= {styles.input_message}>
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPressEnter={SendIb} 
            placeholder="Nhập tin nhắn..."
          />
          <SendOutlined 
            style={{fontSize:'24px', cursor:'pointer', marginLeft: '10px'}}
            onClick={SendIb}
          />
        </div>
      </div>
      
      
    </div>
  )
}

export default ChatWindown
