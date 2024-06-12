import React, { useState } from 'react';
import Login from '../../components/Login/Login';
import Signup from '../../components/Singup/Singup';
import style from './Home.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Home() {
  const [isLogin, setIsLogin] = useState(true);
  
  const handleSubmit = (formData, success) => {
    if (success) {
      toast.success('Sign up successful!');
      console.log('Form submitted:', formData);
    } else {
      toast.error('Sign up failed. Please check your input.');
    }
  };
  
  return (
    <>  <ToastContainer />
      <div className={style.overlay}></div>
    
      <div className={style.container}>
        <h1 className={style.heading}>QUIZZIE</h1>
        <div className={style.singlog}>
          <div 
            onClick={() => setIsLogin(false)} 
            className={!isLogin ? style.active : ''}
          >
            Sign Up
          </div>
          <div 
            onClick={() => setIsLogin(true)} 
            className={isLogin ? style.active : ''}
          >
            Log In
          </div>
        </div>
        {isLogin ? <Login /> : <Signup onSubmit={handleSubmit} />}
     
      </div> 
    </>
  );
}

export default Home;
