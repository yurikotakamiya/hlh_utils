import React, { useState, useEffect } from 'react';
import { Button, Input, Typography, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWithGpt from './ChatWithGpt';

const { Title, Paragraph } = Typography;


const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set up Axios interceptor
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    // Token is invalid or expired, redirect to login page
                    localStorage.removeItem('token');
                    navigate('/');
                }
                return Promise.reject(error);
            }
        );

        // Clean up the interceptor when the component unmounts
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_ROOT}/logout`, {}, {
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
            <Button type="primary" onClick={() => navigate('/register')} style={{ marginLeft: '10px' }}>
                Register
            </Button>
            <ChatWithGpt />
        </div>
    );
};

export default Home;