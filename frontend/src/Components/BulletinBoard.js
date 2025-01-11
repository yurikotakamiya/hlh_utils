import React, { useEffect, useState, useCallback } from 'react';
import { Card, List, Form, Input, Button, Typography, message } from 'antd';
import { AxiosWithAuth } from '../Utils/authenticationService';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const BulletinBoard = () => {
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [formVisible, setFormVisible] = useState(false);

    const fetchMemos = useCallback(async () => {
        try {
            const response = await AxiosWithAuth.get(`/family-memos`);
            setMemos(response.data);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch memos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMemos();
    }, [fetchMemos]);

    const handleAddMemo = async (values) => {
        try {
            await AxiosWithAuth.post(`/family-memos`, values);
            form.resetFields();
            setFormVisible(false);
            fetchMemos();
            message.success('Memo added successfully');
        } catch (error) {
            console.error(error);
            message.error('Failed to add memo');
        }
    };

    const handleArchiveMemo = async (id) => {
        try {
            await AxiosWithAuth.put(`/family-memos/${id}/archive`);
            setMemos(memos.filter((memo) => memo.id !== id));
            message.success('Memo archived successfully');
        } catch (error) {
            console.error(error);
            message.error('Failed to archive memo');
        }
    };

    return (
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
                        HLHF Goals for the Month
                    </Title>
                </div>

                {!formVisible ? (
                    <div style={{ textAlign: 'end', marginBottom: '20px' }}>
                        <Button icon={<PlusOutlined/>} type="text" onClick={() => setFormVisible(true)} style={{ width: '100px' }}>
                            Add
                        </Button>
                    </div>
                ) : (
                    <Form
                        form={form}
                        onFinish={handleAddMemo}
                        layout="vertical"
                        style={{ marginBottom: '20px' }}
                    >
                        <Form.Item
                            name="memo"
                            label="New Memo"
                            rules={[{ required: true, message: 'Please enter a memo' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Type your memo here (supports bullet points, indentation, etc.)"
                                style={{ resize: 'none' }}
                            />
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                                Save Memo
                            </Button>
                            <Button onClick={() => setFormVisible(false)}>Cancel</Button>
                        </div>
                    </Form>
                )}

                <List
                    bordered
                    loading={loading}
                    dataSource={memos}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="link"
                                    onClick={() => handleArchiveMemo(item.id)}
                                    style={{ color: '#e74c3c' }}
                                >
                                    Archive
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                description={
                                    <pre
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            color: '#2c3e50',
                                        }}
                                    >
                                        {item.memo}
                                    </pre>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default BulletinBoard;
