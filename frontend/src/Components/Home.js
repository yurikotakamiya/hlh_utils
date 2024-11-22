import React, { useState } from 'react';
import { Button, Input, Typography, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Home = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [use4o, setUse4o] = useState(false);

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

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        setMessages([...messages, newMessage]);
        setInput('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5001/chat', {
                message: input,
                mode: use4o ? 'gpt-4o' : 'gpt-4o-mini'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const botMessage = { role: 'bot', content: response.data.message };
            setMessages([...messages, newMessage, botMessage]);
        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent adding a new line
            handleSendMessage();
        } else if (event.key === 'Enter' && event.shiftKey) {
            // Allow line change when Shift + Enter is pressed
            adjustInputHeight();
        }
    };

    const adjustInputHeight = () => {
        const inputField = document.getElementById('user-input');
        inputField.style.height = '24px';
        inputField.style.height = Math.min(inputField.scrollHeight, 96) + 'px';
    };

    const toggleChat = () => {
        setIsMinimized(!isMinimized);
    };

    const toggleChatMode = (event) => {
        event.stopPropagation(); // Prevent toggleChat from triggering
        setUse4o(!use4o);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '50px' }}>
            <Title level={1}>Home</Title>
            <Paragraph>Welcome to the home page</Paragraph>
            <Button type="primary" onClick={handleLogout}>
                Logout
            </Button>
            <div className={`chat-popup ${isMinimized ? 'minimized' : ''}`} id="chatPopup" style={{ position: 'fixed', bottom: '0', right: '15px', border: '1px solid #ccc', backgroundColor: 'white', width: '300px', height: isMinimized ? '30px' : '500px', display: 'flex', flexDirection: 'column' }}>
                <div className="chat-header" onClick={toggleChat} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', cursor: 'pointer' }}>
                    Chat
                    <span className="chat-toggle" onClick={toggleChatMode} style={{ float: 'right', cursor: 'pointer' }}>{use4o ? 'full' : 'mini'}</span>
                </div>
                <div className="chat-content" id="chat-box" style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                    <List
                        bordered
                        dataSource={messages}
                        renderItem={item => (
                            <List.Item>
                                <Typography.Text strong>{item.role === 'user' ? 'You' : 'Bot'}:</Typography.Text> <span>{item.content}</span>
                            </List.Item>
                        )}
                        style={{ marginBottom: '20px' }}
                    />
                </div>
                <div className="chat-input" style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
                    <TextArea
                        id="user-input"
                        rows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPressEnter={handleKeyPress}
                        placeholder="Type your message here..."
                        style={{ width: '100%', height: '50px', resize: 'none' }}
                    />
                    <Button type="primary" onClick={handleSendMessage} loading={loading} style={{ marginTop: '10px' }}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;