import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button, Typography } from 'antd';
import { MenuOutlined, HomeOutlined, UnorderedListOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../Utils/authenticationService';

const Layout = () => {
    const navigate = useNavigate();

    const menu = (
        <Menu>
            <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/home')}>
                Home
            </Menu.Item>
            <Menu.Item key="post-list" icon={<UnorderedListOutlined />} onClick={() => navigate('/post-list')}>
                Post List
            </Menu.Item>
            <Menu.Item key="score-sheet" icon={<FileTextOutlined />} onClick={() => navigate('/score-sheet')}>
                Score Sheet
            </Menu.Item>
            <Menu.Item key="youtube-summary" icon={<FileTextOutlined />} onClick={() => navigate('/youtube-summary')}>
                YouTube Summary
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            <div style={{ padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<MenuOutlined />} style={{ border: 'none', boxShadow: 'none' }}/>
                </Dropdown>
                <Typography.Title level={4} style={{ display: 'inline', marginLeft: '10px' }}>HLH Family Utils</Typography.Title>
            </div>
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
