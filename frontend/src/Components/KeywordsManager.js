import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message } from 'antd';
import { AxiosWithAuth } from '../Utils/authenticationService';
import axios from 'axios';

const KeywordsManager = () => {
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKeywords();
    }, []);

    const fetchKeywords = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_ROOT}/keywords`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setKeywords(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            message.error('Failed to fetch keywords');
        }
    };

    const addKeyword = async () => {
        if (!newKeyword.trim()) return;
        try {
            const response = await AxiosWithAuth.post('/keywords', { word: newKeyword });
            setKeywords([...keywords, response.data]);
            setNewKeyword('');
            message.success('Keyword added');
        } catch (err) {
            console.error(err);
            message.error(err.response?.data?.error || 'Failed to add keyword');
        }
    };

    const deleteKeyword = async (id) => {
        try {
            await AxiosWithAuth.delete(`/keywords/${id}`);
            setKeywords(keywords.filter((k) => k.id !== id));
            message.success('Keyword deleted');
        } catch (err) {
            console.error(err);
            message.error('Failed to delete keyword');
        }
    };

    return (
        <div>
            <h2>Manage Keywords</h2>
            <Input
                placeholder="Add new keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onPressEnter={addKeyword}
                style={{ marginBottom: 10 }}
            />
            <Button type="primary" onClick={addKeyword} style={{ marginBottom: 20 }}>
                Add Keyword
            </Button>
            <Table
                dataSource={keywords}
                columns={[
                    { title: 'Keyword', dataIndex: 'word', key: 'word' },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                            <Button danger onClick={() => deleteKeyword(record.id)}>
                                Delete
                            </Button>
                        ),
                    },
                ]}
                rowKey="id"
                loading={loading}
            />
        </div>
    );
};

export default KeywordsManager;
