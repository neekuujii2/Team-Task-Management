import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/SignUp.css'; // Importing external stylesheet

const { Option } = Select;

function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormData = (values) => {
    setFormData({ ...formData, ...values });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Password validation
      if (formData.password !== formData.confirmPassword) {
        message.error('Passwords do not match!');
        return;
      }
      // Pass entire formData object as payload
      await signup(formData);
      message.success('Account created successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMsg = error.response?.data?.msg || 'Registration failed. Please try again.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Form.Item name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
              <Input placeholder="First Name" onChange={(e) => handleFormData({ firstName: e.target.value })} />
            </Form.Item>
            <Form.Item name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
              <Input placeholder="Last Name" onChange={(e) => handleFormData({ lastName: e.target.value })} />
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input placeholder="Email" onChange={(e) => handleFormData({ email: e.target.value })} />
            </Form.Item>
            <Form.Item name="dob" rules={[{ required: true, message: 'Please select your date of birth!' }]}>
              <DatePicker placeholder="Date of Birth" onChange={(date) => handleFormData({ dob: date })} />
            </Form.Item>
            <Form.Item name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
              <Select placeholder="Gender" onChange={(value) => handleFormData({ gender: value })}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </>
        );
      case 3:
        return (
          <>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input placeholder="Username" onChange={(e) => handleFormData({ username: e.target.value })} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password placeholder="Password" onChange={(e) => handleFormData({ password: e.target.value })} />
            </Form.Item>
            <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
              <Input.Password placeholder="Confirm Password" onChange={(e) => handleFormData({ confirmPassword: e.target.value })} />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='signup-background'>
      <div className="signup-container">
        <h2>Sign Up - Step {currentStep}</h2>
        <Form onFinish={currentStep === 3 ? handleSubmit : handleNextStep} className="signup-form">
          {renderFormStep()}
          <div className="button-container">
            {currentStep !== 1 && (
              <Button onClick={handlePrevStep} className="btn-prv">
                Previous
              </Button>
            )}
            {currentStep !== 3 ? (
              <Button type="primary" htmlType="submit" className="btn-nxt">
                Next
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" className="signup-btn" loading={loading}>
                Sign Up
              </Button>
            )}
          </div>
        </Form>
        <div className="login-link">
          Already have an account? <Link to="/login" style={{textDecoration:'none'}}><span style={{color:'white'}}>Log In</span></Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
