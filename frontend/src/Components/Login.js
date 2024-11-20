import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        username: values.username,
        password: values.password,
      });
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '50px' }}>
      <Title level={2}>Login</Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Link to="/register">
            <Button type="link">Register</Button>
          </Link>
        </Form.Item>
      </Form>
      {error && <Text type="danger">{error}</Text>}
    </div>
  );
};

export default Login;