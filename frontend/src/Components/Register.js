import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const { Title, Text } = Typography;

const Register = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            // Generate a random IV
            const iv = CryptoJS.lib.WordArray.random(16);
            // Encrypt the password
            const encryptedPassword = CryptoJS.AES.encrypt(values.password, CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY), { iv: iv }).toString();
            // Concatenate the IV and the encrypted password
            const encryptedData = iv.toString(CryptoJS.enc.Hex) + ':' + encryptedPassword;

            const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/auth/register`, {
                username: values.username,
                password: encryptedData,
            });
            console.log(response.data);
            navigate('/home');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setError(error.response.data.error);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '0 auto', padding: '50px' }}>
            <Title level={2}>Register</Title>
            <Form
                name="register"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                {error && <Text type="danger">{error}</Text>}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;