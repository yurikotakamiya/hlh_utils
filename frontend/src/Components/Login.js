import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const { Title, Text } = Typography;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            console.log('values', values, process.env.REACT_APP_SECRET_KEY);
            // Generate a random IV
            const iv = CryptoJS.lib.WordArray.random(16);
            // Encrypt the password
            const encryptedPassword = CryptoJS.AES.encrypt(values.password, CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY), { iv: iv }).toString();
            // Concatenate the IV and the encrypted password
            const encryptedData = iv.toString(CryptoJS.enc.Hex) + ':' + encryptedPassword;

            const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/login`, {
                username: values.username,
                password: encryptedData,
            });
            localStorage.setItem('token', response.data.token); // Store the token in localStorage
            navigate('/home'); // Navigate to the home page after successful login
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error);
            } else {
                setError('An unexpected error occurred.');
            }
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
                    {/* <Link to="/register">
                        <Button type="link">Register</Button>
                    </Link> */}
                </Form.Item>
            </Form>
            {error && <Text type="danger">{error}</Text>}
        </div>
    );
};

export default Login;