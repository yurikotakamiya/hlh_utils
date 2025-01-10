import React, { useEffect } from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWithGpt from './ChatWithGpt';
import { LogoutOutlined } from '@ant-design/icons';
import BulletinBoard from './BulletinBoard';

const { Title, Paragraph } = Typography;

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set up Axios interceptor
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
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
            await axios.post(`${process.env.REACT_APP_API_ROOT}/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem('token'); // Remove the token from localStorage
            navigate('/'); // Redirect to the login page
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <BulletinBoard />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Card
                    style={{
                        width: '60vw',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Title level={2} style={{ color: '#2c3e50' }}>
                            Contents
                        </Title>
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card
                                hoverable
                                onClick={() => navigate('/post-list')}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: '10px',
                                    height: '100%',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Title level={4}>Post List</Title>
                                <Paragraph>Browse and manage family posts.</Paragraph>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                hoverable
                                onClick={() => navigate('/score-sheet')}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: '10px',
                                    height: '100%',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Title level={4}>Score Sheet</Title>
                                <Paragraph>Track and view family performance scores.</Paragraph>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                hoverable
                                onClick={() => navigate('/register')}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: '10px',
                                    height: '100%',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Title level={4}>Register</Title>
                                <Paragraph>Create a new family member account.</Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button type="default" onClick={handleLogout}>
                    <LogoutOutlined /> Logout
                </Button>
            </div>

            <ChatWithGpt />
        </div>
    );
};

export default Home;
