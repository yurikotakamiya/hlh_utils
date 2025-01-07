import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tabs, Popover } from 'antd';

const ScoreHeatmap = ({ availableYears, data, loading, setSelectedYear, selectedYear, columnNames }) => {
    const getColorForValue = (count) => {
        if (!count || count === undefined) return '#ebedf0';
        if (count >= 3) return '#7bc96f';
        if (count >= 2) return '#c6e48b';
        if (count >= 1) return '#ebedf0';
        return '#ebedf0';
    };

    const renderHeatmapDay = (el, value) => {
        const color = value ? getColorForValue(value.count) : '#ebedf0';
        return (
            <Popover
                content={
                    value && value.date ? (
                        <>
                            <p><strong>Date:</strong> {value.date}</p>
                            <p><strong>Score:</strong> {value.count.toFixed(2)}</p>
                            <p><strong>Comment:</strong> {value.comment}</p>
                        </>
                    ) : 'No data available'
                }
                title={value && value.date ? `Score: ${value.count.toFixed(2)}` : 'No Data'}
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

    // Filter and prepare data for each category
    const categoryHeatmaps = Object.keys(columnNames).map((col) => {
        const categoryData = data
            .filter((entry) => new Date(entry.date).getFullYear() === selectedYear)
            .map((entry) => ({
                date: entry.date,
                count: entry[col] || 0, // Use the specific column's value
                comment: entry.comment || '',
            }));

        return { category: columnNames[col], data: categoryData };
    });

    // Prepare "All Categories" data
    const allCategoriesData = data
        .filter((entry) => new Date(entry.date).getFullYear() === selectedYear)
        .map((entry) => {
            const totalScore = Object.keys(columnNames).reduce((sum, col) => sum + (entry[col] || 0), 0);
            const avgScore = totalScore / Object.keys(columnNames).length;

            return {
                date: entry.date,
                count: avgScore,
                comment: entry.comment || '',
            };
        });

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Score Heatmap</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Tabs
                    tabPosition="top"
                    items={[
                        {
                            label: 'All Categories',
                            key: 'all',
                            children: (
                                <div style={{ display: 'flex', alignItems: 'flex-start', width: '60vw' }}>
                                    {/* Heatmap */}
                                    <div style={{ flex: 1 }}>
                                        <CalendarHeatmap
                                            startDate={new Date(`${selectedYear}-01-01`)}
                                            endDate={new Date(`${selectedYear}-12-31`)}
                                            values={allCategoriesData}
                                            showWeekdayLabels
                                            transformDayElement={(el, value) => renderHeatmapDay(el, value)}
                                        />
                                    </div>

                                    {/* Year Tabs */}
                                    <div style={{ marginLeft: '20px', minWidth: '100px' }}>
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
                            ),
                        },
                        ...categoryHeatmaps.map(({ category, data }) => ({
                            label: category,
                            key: category,
                            children: (
                                <div style={{ display: 'flex', alignItems: 'flex-start', width: '60vw' }}>
                                    {/* Heatmap */}
                                    <div style={{ flex: 1 }}>
                                        <CalendarHeatmap
                                            startDate={new Date(`${selectedYear}-01-01`)}
                                            endDate={new Date(`${selectedYear}-12-31`)}
                                            values={data}
                                            showWeekdayLabels
                                            transformDayElement={(el, value) => renderHeatmapDay(el, value)}
                                        />
                                    </div>

                                    {/* Year Tabs */}
                                    <div style={{ marginLeft: '20px', minWidth: '100px' }}>
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
                            ),
                        })),
                    ]}
                />
            )}
        </div>
    );
};

export default ScoreHeatmap;
