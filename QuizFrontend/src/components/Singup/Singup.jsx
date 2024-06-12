import React, { useState } from "react";
import style from './Singup.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from "../../apis/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Reset error state when user starts typing
    setErrors({ ...errors, [name]: false });
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name === '',
      email: !/\S+@\S+\.\S+/.test(formData.email),
      password: formData.password.length < 6,
      confirmPassword: formData.confirmPassword === "" || formData.password !== formData.confirmPassword,
      
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Form submitted:", formData);
    
    const success = validateForm();
    if (success) {
      try {
        await registerUser({ name: formData.name, email: formData.email, password: formData.password }); 
        toast.success('Sign up successful!');
        navigate("/");
      } catch (error) {
        toast.error('Sign up failed. Please try again.');
      }
    }
  };
  return (
     <div>
      <ToastContainer />
      <form >
      <div className={style.container}>  <div className={style.label}>
          <label>Name</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder={errors.name ? "Invalid Name" : ""}
            className={errors.name ? style.invalid : ""}
          />
        </div>
        <div className={style.label}>
          <label>Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            placeholder={errors.email ? "Invalid Email" : ""}
            className={errors.email ? style.invalid : ""}
          />
        </div>
        <div className={style.label}>
          <label>Password</label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            placeholder={errors.password ? "weak password" : ""}
            className={errors.password ? style.invalid : ""}
          />
        </div>
        <div className={style.label}>
          <label>Confirm Password</label>
          <input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleFormChange}
            placeholder={errors.confirmPassword ? "password doesn’t match" : ""}
            className={errors.confirmPassword ? style.invalid : ""}
          />
        </div>
        
          <button  onClick={handleSubmit}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
