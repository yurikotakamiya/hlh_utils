import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Modal, Alert, Card, List, Typography, Button } from 'antd';
import axios from 'axios';
import DynamicContent from './DynamicContent';
import DOMPurify from 'dompurify';
import KeywordsManager from './KeywordsManager';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedComments, setSelectedComments] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showKeywordsModal, setShowKeywordsModal] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_ROOT}/posts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const groupedPosts = response.data.reduce((acc, post) => {
                    const date = post.date.split('T')[0]; // Extract date
                    acc[date] = acc[date] || [];
                    acc[date].push(post);
                    return acc;
                }, {});
                setPosts(Object.entries(groupedPosts).sort((a, b) => new Date(b[0]) - new Date(a[0])));
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const viewPost = async (date, filename, title) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ROOT}/posts/${date}/${filename}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedPost({ content: response.data, date, filename, title });
        } catch (err) {
            console.error('Error fetching post content:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const viewComments = async (date, postId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ROOT}/comments/${date}/post-${postId}-comments.html`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const sanitizedHtml = DOMPurify.sanitize(response.data);
            setSelectedComments({ content: sanitizedHtml, date, postId });
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !posts.length) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Button onClick={() => setShowKeywordsModal(true)}>Manage Keywords</Button>
            <Modal
                open={showKeywordsModal}
                onCancel={() => setShowKeywordsModal(false)}
                width="80vw"
                footer={null}
            >
                <KeywordsManager />
            </Modal>

            <h1>Scraped Posts</h1>
            <Tabs>
                {posts.map(([date, postsForDate]) => (
                    <Tabs.TabPane tab={date} key={date}>
                        <List
                            itemLayout="vertical"
                            dataSource={postsForDate}
                            renderItem={(posts) => {
                                return posts?.posts?.map((post) => <List.Item
                                    onClick={() => {
                                        viewPost(date, `post-${post.id}.html`, post.title);
                                        viewComments(date, post.id);
                                    }}
                                >
                                    <Typography.Text>{post.title}</Typography.Text>
                                </List.Item>


                            )}}

                        />
                    </Tabs.TabPane>
                ))}
            </Tabs>

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            )}

            {selectedPost && (
                <Modal
                    title={selectedPost.title}
                    open={selectedPost !== null}
                    onOk={() => setSelectedPost(null)}
                    onCancel={() => setSelectedPost(null)}
                    width="80vw"
                >
                    <Card title={selectedPost.title} bordered style={{ borderRadius: '8px' }}>
                        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <DynamicContent htmlContent={selectedPost.content} />
                            <h2>Comments</h2>
                            {selectedComments?.content ? (
                                <div dangerouslySetInnerHTML={{ __html: selectedComments.content }} />
                            ) : (
                                <p>No comments available</p>
                            )}
                        </div>
                    </Card>
                </Modal>
            )}
        </div>
    );
};

export default PostList;
