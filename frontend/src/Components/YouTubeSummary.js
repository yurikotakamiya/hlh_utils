import React, { useState } from 'react';
import { Input, Button, Card, Spin, message, Typography } from 'antd';
import { AxiosWithAuth } from '../Utils/authenticationService';

const { TextArea } = Input;
const { Title } = Typography;

const YouTubeSummary = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!videoUrl) {
            message.error('Please enter a valid YouTube URL.');
            return;
        }

        setLoading(true);
        setSummary('');
        try {
            const response = await AxiosWithAuth.post(`/youtube/summary`, {
                url: videoUrl,
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error summarizing video:', error);
            message.error('Failed to summarize the video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '60vw', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                <Title level={3} style={{ textAlign: 'center' }}>YouTube Video Summary</Title>
                <Input
                    placeholder="Paste YouTube video URL here"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
                <Button type="primary" onClick={handleSummarize} disabled={loading} block>
                    Summarize
                </Button>
                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Spin tip="Fetching and summarizing video..." />
                    </div>
                )}
                {summary && (
                    <Card style={{ marginTop: '20px', backgroundColor: '#f9f9f9' }}>
                        <Title level={4}>Summary:</Title>
                        <TextArea
                            rows={10}
                            value={summary}
                            readOnly
                            style={{ resize: 'none', backgroundColor: '#f9f9f9', border: 'none' }}
                        />
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default YouTubeSummary;
