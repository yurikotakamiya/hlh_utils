import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, message, Typography, Card, Tabs, Table } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { AxiosWithAuth, currentUser } from '../Utils/authenticationService';
import ScoreHeatmap from './ScoreHeatmap';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/en_US';
moment.locale('en');

const { Title } = Typography;

const ScoreSheet = () => {
    const [form] = Form.useForm();
    const [columnForm] = Form.useForm();
    const [displayNames, setDisplayNames] = useState({});
    const [openSubmitScoreCard, setOpenSubmitScoreCard] = useState(false);
    const [openUpdateColumnNamesCard, setOpenUpdateColumnNamesCard] = useState(false);
    const [availableYears, setAvailableYears] = useState([]);
    const [scoreData, setScoreData] = useState([]);
    const [scoreDataLoading, setScoreDataLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const userId = currentUser.id;

    // Fetch existing column names
    useEffect(() => {
        if (!userId) return;
        const fetchColumnNames = async () => {
            try {
                await AxiosWithAuth.get(`/scores/score-column-names/${userId}`)
                    .then((response) => {
                        const names = response.data.reduce((acc, { col_name, friendly_name }) => {
                            acc[col_name] = friendly_name;
                            return acc;
                        }, {});
                        setDisplayNames(names);
                        columnForm.setFieldsValue(names); // Prefill the column names
                    })
            } catch (error) {
                console.error('Error fetching column names:', error);
            }
        };
        fetchColumnNames();
    }, [userId, columnForm]);

    useEffect(() => {
        if (!userId) return;
        const fetchScores = async () => {
            try {
                const scoreResponse = await AxiosWithAuth.get(`scores/${userId}`);
                const scores = scoreResponse.data;

                const years = Array.from(new Set(scores.map((row) => new Date(row.date).getFullYear())));
                setAvailableYears(years);
                if (!years.includes(selectedYear)) {
                    setSelectedYear(new Date().getFullYear());
                }

                const transformedData = scores.sort((a, b) => new Date(b.date) - new Date(a.date)).map((row) => ({
                    date: row.date.split('T')[0],
                    count: Object.keys(row)
                        .filter((key) => key.startsWith('col_'))
                        .reduce((sum, key) => sum + row[key], 0),
                    comment: row.comment || '',
                    ...row, // Include the entire row for detailed list view
                }));

                setScoreData(transformedData);
            } catch (error) {
                console.error('Error fetching scores:', error);
            } finally {
                setScoreDataLoading(false);
            }
        };

        fetchScores();
    }, [userId, selectedYear]);

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

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        ...Object.keys(displayNames).map((col) => ({
            title: displayNames[col] || col,
            dataIndex: col,
            key: col,
        })),
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Score Sheet</Title>

            <Tabs defaultActiveKey="heatmap">
                <Tabs.TabPane tab="Heatmap View" key="heatmap">
                    <ScoreHeatmap
                        availableYears={availableYears}
                        data={scoreData}
                        loading={scoreDataLoading}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        columnNames={displayNames}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab="List View" key="list">
                    <Table
                        dataSource={scoreData}
                        columns={columns}
                        rowKey="date"
                        loading={scoreDataLoading}
                        pagination={{ pageSize: 10 }}
                    />
                </Tabs.TabPane>
            </Tabs>

            {/* Score Submission */}
            <Card title="Submit Scores" style={{ marginBottom: '20px' }} extra={<Button onClick={() => setOpenSubmitScoreCard(!openSubmitScoreCard)}>{openSubmitScoreCard ? 'Close' :'Open'}</Button>}>
                {openSubmitScoreCard ? (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleScoreSubmit}
                    >
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: 'Please select a date!' }]}
                        >
                            <DatePicker locale={locale}/>
                        </Form.Item>
                        {Object.entries(displayNames).map(([col, displayName]) => (
                            <Form.Item
                                key={col}
                                label={displayName}
                                name={['scores', col]}
                            >
                                <InputNumber min={1} max={3} />
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
                ) : (
                    <Typography.Text>
                        Click the button to submit your score for the day <SmileOutlined />
                    </Typography.Text>
                )}
            </Card>

            {/* Update Column Names */}
            <Card title="Update Column Names" style={{ marginBottom: '20px' }} extra={<Button onClick={() => setOpenUpdateColumnNamesCard(!openUpdateColumnNamesCard)}>{openUpdateColumnNamesCard ? 'Close' :'Open'}</Button>}>
                {openUpdateColumnNamesCard ? (
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
                ) : (
                    <Typography.Text>
                        Click the button to update the column names <SmileOutlined />
                    </Typography.Text>
                )}
            </Card>
        </div>
    );
};

export default ScoreSheet;
