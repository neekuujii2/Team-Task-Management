import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/Login.css'; // Importing external stylesheet

function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      console.log('🔐 Attempting login with:', email);
      await login({ email, password });
      message.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('❌ Login failed:', error);
      const errorMsg = error.response?.data?.msg || 'Login failed. Please try again.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
 
    
  return (
    <div className='login-background'>
    <div className="login-container">
      <h2>Login</h2>
      <Form onFinish={handleSubmit} className="login-form">
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input ref={emailRef} placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password ref={passwordRef} placeholder="Password" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-btn" size="large" loading={loading}>
            Log In
          </Button>
        </Form.Item>
      </Form>
      <div className="signup-link">
        Need an account? <Link to="/signup" style={{textDecoration: 'none'}}><span style={{color:'white'}}>Sign Up</span></Link>
      </div>
    </div>
    </div>
  );
}

export default Login;
