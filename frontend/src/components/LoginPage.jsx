import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";


const LoginPage = ({login, showNotification}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password:"",
  });
   const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData({...formData,[name]: value});
   }
   const handleSubmit= async(event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/login`, 
        {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          body: JSON.stringify(formData), 
        }
        );

        if(!response.ok) throw new Error("Login Failed");
        const {token, user} = await response.json();

        login(token, user);
        showNotification("Logged in successfully", "success");
         if(user.role === "admin"){
           navigate("/admin");
         } else {
          navigate("/");
         }

    } catch (error) {
      showNotification(error.message, "error");
    }
   } 

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Email:</label>
          <input 
          type="email"
           name="email" 
           value={formData.email} 
           onChange={handleChange}/>
        </div>

        <div className='form-group'>
          <label>Password:</label>
          <input 
          type="password"
           name="password" 
           value={formData.password} 
           onChange={handleChange}/>
        </div>
        <button type='submit' className='submit-btn'>Login</button>
      </form>
    </div>
  )
};

export default LoginPage