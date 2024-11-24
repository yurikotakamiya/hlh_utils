import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/register`, {
                username: values.username,
                password: values.password,
            });
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.log(error);
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
                        Register
                    </Button>
                </Form.Item>
            </Form>
            {error && <Text type="danger">{error}</Text>}
        </div>
    );
};

export default Register;