import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tabs, Popover } from 'antd';
import { AxiosWithAuth, currentUser } from '../Utils/authenticationService';

const ScoreHeatmap = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const userId = currentUser.id;

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const scoreResponse = await AxiosWithAuth.get(`scores/${userId}`);
                const scores = scoreResponse.data;

                const years = Array.from(new Set(scores.map((row) => new Date(row.date).getFullYear())));
                setAvailableYears(years);
                if (!years.includes(selectedYear)) {
                    setSelectedYear(new Date().getFullYear());
                }

                const transformedData = scores.map((row) => ({
                    date: row.date.split('T')[0],
                    count: Object.keys(row)
                        .filter((key) => key.startsWith('col_'))
                        .reduce((sum, key) => sum + row[key], 0),
                    comment: row.comment || '',
                }));

                setData(transformedData);
            } catch (error) {
                console.error('Error fetching scores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [userId, selectedYear]);

    const getColorForValue = (count) => {
        if (!count || count === undefined) return '#ebedf0';
        if (count >= 50) return '#239a3b';
        if (count >= 30) return '#7bc96f';
        if (count >= 10) return '#c6e48b';
        return '#c6e48b';
    };

    const renderHeatmapDay = (el, value) => {
        const color = value ? getColorForValue(value.count) : '#ebedf0';
        return (
            <Popover
                content={
                    value && value.date ? (
                        <>
                            <p><strong>Date:</strong> {value.date}</p>
                            <p><strong>Score:</strong> {value.count}</p>
                            <p><strong>Comment:</strong> {value.comment}</p>
                        </>
                    ) : 'No data available'
                }
                title={value && value.date ? `Total Score: ${value.count}` : 'No Data'}
                trigger="hover"
            >
                <rect
                    x={el.props.x}
                    y={el.props.y}
                    width="10"
                    height="10"
                    fill={color}
                    rx="2"
                />
            </Popover>
        );
    };

    const filteredData = data.filter((entry) =>
        new Date(entry.date).getFullYear() === selectedYear
    );

    return (
        <div style={{ padding: '20px', display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'center' }}>Score Heatmap</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <CalendarHeatmap
                        startDate={new Date(`${selectedYear}-01-01`)}
                        endDate={new Date(`${selectedYear}-12-31`)}
                        values={filteredData}
                        showWeekdayLabels
                        transformDayElement={(el, value) => renderHeatmapDay(el, value)}
                    />
                )}
            </div>
            <div style={{ width: '100px', marginLeft: '20px' }}>
                <h3>Years</h3>
                <Tabs
                    tabPosition="right"
                    activeKey={String(selectedYear)}
                    onChange={(key) => setSelectedYear(Number(key))}
                    items={availableYears.map((year) => ({
                        label: year,
                        key: String(year),
                    }))}
                />
            </div>
        </div>
    );
};

export default ScoreHeatmap;
