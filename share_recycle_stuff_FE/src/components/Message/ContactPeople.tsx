//file này lấy ra danh sách những người đã từng liên hệ

import type { ContactPerson } from '../../types/schema'
import styles from './Message.module.css'

interface ContactPeopleProp {
  contactPeople: ContactPerson [];
  ibWith: (receiverId : number, receiverName : string) => void; 
}

const ContactPeople = ({contactPeople, ibWith} : ContactPeopleProp) => {

  return (
    <div className= {styles.contact_container}>
      {contactPeople.map(person => (
        <div 
          key={person.id} 
          className= {styles.person_item}
          onClick={()=> ibWith(person.id, person.fullName)}  
        >
            <img src={person.avatarUrl} className= {styles.contactAvt}/>
            <span style={{marginLeft:'12px'}}>{person.fullName}</span>
        </div>
      ))}
    </div>
  )
}

export default ContactPeople
