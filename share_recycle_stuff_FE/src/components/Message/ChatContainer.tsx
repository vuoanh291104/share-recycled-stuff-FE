// file này sẽ là nơi check xem là ContactPeople hay ChatWindown

import {CloseCircleFilled, ArrowLeftOutlined } from '@ant-design/icons'
import styles from './Message.module.css'
import type { ContactPerson } from '../../types/schema';
import { useEffect, useState } from 'react';
import ContactPeople from './ContactPeople';
import ChatWindown from './ChatWindown';
import { getData } from '../../api/api';

interface ChatContainerProp {
  onClose: () => void;
  defaultReceiverId?: number;
  defaultReceiverName?: string;
}

interface ContactPeopleResponse {
  message: string;
  result: ContactPerson [];
}


const ChatContainer = ({onClose, defaultReceiverId, defaultReceiverName} : ChatContainerProp) => {

  const [isContactList, setIsContactList] = useState (true);
  const [receiverId, setReceiverId] = useState<number>(0);
  const [receiverName, setReceiverName] = useState<string>('');
  const [contactedList, setContactedList] = useState <ContactPerson[]>([]);

  //Nếu tồn tại giá trị default của id ng nhận và tên ng nhận thì mở luôn ChatWindown
  // Ở headerProfile cần truyền giá trị default như này
  useEffect(() => {
    if (defaultReceiverId && defaultReceiverName) {
      setReceiverId(defaultReceiverId);
      setReceiverName(defaultReceiverName);
      setIsContactList(false); 
    }
  }, [defaultReceiverId, defaultReceiverName]);

  //Gọi prop đóng chat box của cha
  const CloseChatBox = () => {
    onClose();
  }

  // check xem là list Contact hay vô ib riêng r
  const ibWith = (receiverID: number, receiverName: string) => {
    setReceiverId(receiverID);
    setReceiverName(receiverName);
    setIsContactList (false);
  }

  const moveToContactList = () => {
    setReceiverId(0);
    setReceiverName('');
    setIsContactList(true);
  }

  //lấy list contact lên 

  const getContactList = async () => {
    try {
      const res = await getData<ContactPeopleResponse> (`/api/v1/chat/recent-users`);
      console.log(res.result, res.message)
      setContactedList(res.result);
    } catch (error) {
      
    }
  }
  useEffect (() => {
    getContactList();
  },[])

  return (
    <div className= {styles.chat_box}>
        <div className= {styles.box_header}>
                <span>
                  {!isContactList && 
                    <ArrowLeftOutlined style={{marginRight: '10px', cursor:'pointer'}} 
                      onClick={moveToContactList}
                    />
                  }
                  {isContactList? 'Tin nhắn' : receiverName}
                </span>
                <CloseCircleFilled 
                  style={{fontSize:'24px'}}
                  onClick={CloseChatBox}
                />

        </div>
        {
          isContactList?
          <ContactPeople 
            contactPeople={contactedList}
            ibWith={ibWith}
          /> 
            :
          <ChatWindown receiverId={receiverId} />
        }
    </div>
  )
}

export default ChatContainer
