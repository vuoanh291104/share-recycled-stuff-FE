import { useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import {motion, AnimatePresence} from 'framer-motion'
import styles from './auth.module.css'
import clsx from "clsx";

const Auth = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const offset = 48; 
  const slideDistance = 470; 

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
      <div style={{marginRight:300}}></div>
      <div 
        className={clsx(styles.auth_container, styles.quicksand_bold)}
        style={isLoginPage ? { paddingLeft: 48 } : { paddingRight: 48 }}
        
      >
        <motion.div
          className={clsx(styles.with_form, {
            [styles.with_form_mr]: isLoginPage,
            [styles.with_form_ml]: !isLoginPage
          })}
          animate={{ x: isLoginPage ? 0 : slideDistance  }} 
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {isLoginPage ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
              >
                <Login />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Register />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          animate={{ x: isLoginPage ? 0 : -slideDistance - offset }} 
          transition={{ duration: 0.8, ease: "easeInOut" }}     
        >
          <img src="/src/assets/baner_auth.svg" 
            className={styles.banner_img}
            alt="banner"/>
        </motion.div>
      </div>
    </div>
    
  )
}

export default Auth
