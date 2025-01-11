import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { AxiosWithAuth } from '../Utils/authenticationService';

const { Option } = Select;

const YouTubeSummaryForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');

    const handleSubmit = async (values) => {
        const { url, language } = values;
        setLoading(true);
        setSummary('');

        try {
            const response = await AxiosWithAuth.post(`${process.env.REACT_APP_API_ROOT}/youtube/summary`, {
                url,
                language,
            });

            setSummary(response.data.summary);
            message.success('Summary generated successfully!');
        } catch (error) {
            console.error('Error fetching summary:', error);
            message.error('Failed to generate summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    label="YouTube URL"
                    name="url"
                    rules={[{ required: true, message: 'Please enter a YouTube URL' }]}
                >
                    <Input placeholder="Enter YouTube video URL" />
                </Form.Item>
                <Form.Item label="Subtitle Language" name="language">
                    <Select placeholder="Select a language (default: English)">
                        <Option value="en">English</Option>
                        <Option value="ko">Korean</Option>
                        <Option value="ja">Japanese</Option>
                        <Option value="es">Spanish</Option>
                        <Option value="fr">French</Option>
                        <Option value="de">German</Option>
                        {/* Add more language options as needed */}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Summarize Video
                    </Button>
                </Form.Item>
            </Form>
            {summary && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default YouTubeSummaryForm;
