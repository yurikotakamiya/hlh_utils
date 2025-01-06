import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, message, Typography, Card } from 'antd';
import { AxiosWithAuth, currentUser } from '../Utils/authenticationService';
import ScoreHeatmap from './ScoreHeatmap';
import moment from 'moment';
moment.locale('en');

const { Title } = Typography;

const ScoreSheet = () => {
    const [form] = Form.useForm();
    const [columnForm] = Form.useForm();
    const [displayNames, setDisplayNames] = useState({});
    const userId = currentUser.id;

    // Fetch existing column names
    useEffect(() => {
        AxiosWithAuth.get(`/scores/score-column-names/${userId}`)
            .then((response) => {
                const names = response.data.reduce((acc, { col_name, friendly_name }) => {
                    acc[col_name] = friendly_name;
                    return acc;
                }, {});
                setDisplayNames(names);
                columnForm.setFieldsValue(names); // Prefill the column names
            })
            .catch((err) => {
                console.error(err);
                message.error('Failed to fetch column names.');
            });
    }, [userId, columnForm]);

    const handleScoreSubmit = async (values) => {
        try {
            const response = await AxiosWithAuth.post(`/scores`, {
                user_id: userId,
                date: values.date.format('YYYY-MM-DD'),
                scores: values.scores,
                comment: values.comment,
            });
            console.log(response.data);
            message.success('Scores submitted successfully.');
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error('Failed to submit scores.');
        }
    };

    const handleColumnNameSubmit = async (values) => {
        try {
            const columnNames = Object.keys(values).reduce((acc, col_name) => {
                acc[col_name] = values[col_name];
                return acc;
            }, {});
            await AxiosWithAuth.put(`/scores/score-column-names`, {
                user_id: userId,
                column_names: columnNames,
            });
            message.success('Column names updated successfully.');
            setDisplayNames(columnNames); // Update local state
        } catch (err) {
            console.error(err);
            message.error('Failed to update column names.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Score Sheet</Title>
            <ScoreHeatmap />

            {/* Score Submission */}
            <Card title="Submit Scores" style={{ marginBottom: '20px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleScoreSubmit}
                    initialValues={{ date: moment() }}
                >
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select a date!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    {[...Array(10)].map((_, i) => (
                        <Form.Item
                            key={i}
                            label={displayNames[`col_${i + 1}`] || `Column ${i + 1}`}
                            name={['scores', `col_${i + 1}`]}
                        >
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                    ))}
                    <Form.Item label="Comment" name="comment">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Scores
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Update Column Names */}
            <Card title="Update Column Names">
                <Form
                    form={columnForm}
                    layout="vertical"
                    onFinish={handleColumnNameSubmit}
                >
                    {[...Array(10)].map((_, i) => (
                        <Form.Item
                            key={i}
                            label={`Column ${i + 1} Name`}
                            name={`col_${i + 1}`}
                        >
                            <Input />
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Column Names
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ScoreSheet;
