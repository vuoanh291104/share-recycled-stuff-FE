import { Button } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import '/src/styles/GlobalStyle.css';
import styles from '../../pages/public/auth.module.css'
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginGG = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      //Call BE
      console.log(tokenResponse)
      navigate('/');
    },
    onError: errorResponse => console.log(errorResponse),
  })
  return (
    <div>
      <Button 
        className={styles.btnGG}
        onClick={() => login()}
      > 
        <FcGoogle style={{fontSize:24, marginInlineEnd:8}}/>
        <span>Đăng nhập với Google</span>  
        </Button>
    </div>
  )
}

export default LoginGG
