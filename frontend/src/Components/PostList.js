import React, { useState, useEffect } from 'react';
import { Spin, Modal, Alert, Card, List, Typography, Button } from 'antd';
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
                setPosts(response.data?.sort((a, b) => new Date(b.date) - new Date(a.date)));
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

    const viewComments = async (date, postId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
    
        try {
            await axios.get(
                `${process.env.REACT_APP_API_ROOT}/comments/${date}/post-${postId}-comments.html`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((response) => {
                const sanitizedHtml = DOMPurify.sanitize(response.data);
                setSelectedComments({ content: sanitizedHtml, date, postId });
            }).catch((err) => {
                console.error('Error fetching comments:', err);
                setSelectedComments({ content: '', date, postId });
            });
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
            <Button onClick={() => setShowKeywordsModal(true)}>Manage Keywords</Button>
            <Modal
                open={showKeywordsModal}
                onCancel={() => setShowKeywordsModal(false)}
                width='80vw'
                footer={null}
            >
                <KeywordsManager />
            </Modal>

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
                                <List.Item onClick={() => {
                                    viewPost(group.date, `post-${post.id}.html`, post.title)
                                    viewComments(group.date, post.id)
                                }}>
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
                            <div>
                                <h2>Comments</h2>
                                {selectedComments?.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: selectedComments.content }} />
                                ) : (
                                    <p>No comments available</p>
                                )}
                            </div>

                        </div>
                    </Card>
                </div>
            </Modal>)}
        </div>
    );
};

export default PostList;
