import React, { useState, useEffect } from 'react';
import { Spin, Modal, Alert, Card, List, Typography } from 'antd';
import axios from 'axios';
import DynamicContent from './DynamicContent';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch grouped posts on mount
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token'); // Retrieve token from local storage

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_ROOT}/posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);
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
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            setSelectedPost({ content: response.data, date, filename, title });
        } catch (err) {
            console.error('Error fetching post content:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !posts.length) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin tip="Loading posts..." />
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
            <h1>Scraped Posts</h1>
            <List
                itemLayout="vertical"
                dataSource={posts}
                renderItem={(group) => (
                    <div key={group.date} style={{ marginBottom: '20px' }}>
                        <h2>{group.date}</h2>
                        <List
                            dataSource={group.posts}
                            renderItem={(post) => (
                                <List.Item onClick={() => viewPost(group.date, `post-${post.id}.html`, post.title)}>
                                    <Typography level={5}>{`${post.title} - ${post.date}`}</Typography>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            />


            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin tip="Loading post content..." />
                </div>
            )}

            {selectedPost && (<Modal
                title={selectedPost.title}
                open={selectedPost !== null}
                onOk={() => setSelectedPost(null)}
                onCancel={() => setSelectedPost(null)}
                width='80vw'
            >
                <div style={{ marginTop: '20px' }}>
                    <Card
                        title={`${selectedPost.title} --- id: ${selectedPost.filename}`}
                        bordered={true}
                        style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '8px',
                        }}
                    >
                        <div className="modal-content" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <DynamicContent htmlContent={selectedPost.content} />
                        </div>
                    </Card>
                </div>
            </Modal>)}
        </div>
    );
};

export default PostList;
