import React, { useState, useRef } from 'react';
import { Button, Input, Typography, List } from 'antd';
import axios from 'axios';

import { marked } from 'marked';

const { TextArea } = Input;

const ChatWithGpt = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [use4o, setUse4o] = useState(false);
    const [size, setSize] = useState({ width: 300, height: 500 });
    const [position, setPosition] = useState({ x: 15, y: window.innerHeight - 515 });
    const chatRef = useRef(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        setMessages([...messages, newMessage]);
        setInput('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/chat`, {
                message: input,
                mode: use4o ? 'gpt-4o' : 'gpt-4o-mini'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const botMessage = { role: 'bot', content: marked(response.data.message) };
            setMessages([...messages, newMessage, botMessage]);
        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleChat = () => {
        setIsMinimized(!isMinimized);
    };

    const toggleChatMode = (event) => {
        event.stopPropagation(); // Prevent toggleChat from triggering
        setUse4o(!use4o);
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

    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;
        const startTop = position.y;

        const doDrag = (dragEvent) => {
            const newWidth = startWidth + (dragEvent.clientX - startX);
            const newHeight = startHeight - (dragEvent.clientY - startY);
            const newTop = startTop + (dragEvent.clientY - startY);
            setSize({
                width: newWidth > 300 ? newWidth : 300, // Minimum width
                height: newHeight > 100 ? newHeight : 100, // Minimum height
            });
            setPosition({
                x: position.x,
                y: newTop,
            });
        };

        const stopDrag = () => {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        };

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    };

    const handleDragMouseDown = (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = position.x;
        const startTop = position.y;

        const doDrag = (dragEvent) => {
            setPosition({
                x: startLeft + dragEvent.clientX - startX,
                y: startTop + dragEvent.clientY - startY,
            });
        };

        const stopDrag = () => {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        };

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    };

    return (
        <div
            ref={chatRef}
            className={`chat-popup ${isMinimized ? 'minimized' : ''}`}
            id="chatPopup"
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                bottom: isMinimized ? '0' : `${window.innerHeight - position.y - size.height}px`,
                border: '1px solid #ccc',
                backgroundColor: 'white',
                width: `${size.width}px`,
                height: isMinimized ? '30px' : `${size.height}px`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                className="chat-header"
                onMouseDown={handleDragMouseDown}
                onClick={toggleChat}
                style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', cursor: 'move' }}
            >
                Chat
                <span className="chat-toggle" onClick={toggleChatMode} style={{ float: 'right', cursor: 'pointer' }}>
                    {use4o ? 'full' : 'mini'}
                </span>
            </div>
            {!isMinimized && (
                <>
                    <div className="chat-content" id="chat-box" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                        <List
                            dataSource={messages}
                            renderItem={(item) => (
                                <>
                                    <Typography.Text strong>{item.role === 'user' ? 'You' : 'Bot'}:</Typography.Text>
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                </>
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
                </>
            )}
            <div
                style={{
                    width: '5px',
                    height: '5px',
                    backgroundColor: 'gray',
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    cursor: 'nwse-resize',
                }}
                onMouseDown={handleResizeMouseDown}
            />
        </div>
    );
};

export default ChatWithGpt;