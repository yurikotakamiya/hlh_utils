import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const Home = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5001/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('token'); // Remove the token from localStorage
            navigate('/'); // Redirect to the login page
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '50px' }}>
            <Title level={1}>Home</Title>
            <Paragraph>Welcome to the home page</Paragraph>
            <Button type="primary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Home;