import styles from './EditProfile.module.css'
import { useState } from 'react';
import EditInfo from './EditInfo';
import ChangePass from './ChangePass';


const EditProfile = () => {
    const [isInfo, setIsInfo] = useState(true);

     
  return (
    <div className= {styles.editContainer} >
        <div className= {styles.editHeader}>

            <p className={`${styles.selectTypeEdit} ${isInfo ? styles.active : ""}`}
            onClick={() => setIsInfo (true)}
            >Chỉnh sửa thông tin</p>

            <p  className={`${styles.selectTypeEdit} ${!isInfo ? styles.active : ""}`}
            onClick={() => setIsInfo (false)}
            >Đổi mật khẩu</p>
            
        </div>
        <div className= {styles.editTypeBody}>
            {isInfo? <EditInfo /> : <ChangePass />}
        </div>
        
        
    </div>
  )
}

export default EditProfile
