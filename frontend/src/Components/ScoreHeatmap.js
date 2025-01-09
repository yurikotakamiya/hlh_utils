import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tabs, Popover } from 'antd';
import moment from 'moment';
moment.locale('en');


const ScoreHeatmap = ({ availableYears, data, loading, setSelectedYear, selectedYear, columnNames }) => {
    // it should be moment.utc(`${selectedYear}-01-01`).toDate(); - 1 day
    const startDate = moment.utc(`${selectedYear}-01-01`).add(-1, 'day').toDate();
    const endDate = moment.utc(`${selectedYear}-12-31`).add(-1, 'day').toDate();    

    const getColorForValue = (count) => {
        if (!count || count === undefined) return '#ebedf0';
        if (count >= 3) return '#239a3b';
        if (count >= 2) return '#7bc96f';
        if (count >= 1) return '#c6e48b';
        return '#ebedf0';
    };

    const renderHeatmapDay = (el, value) => {
        const color = value ? getColorForValue(value.count) : '#ebedf0';
        return (
            <Popover
                content={
                    value && value.date ? (
                        <>
                            <p><strong>Date:</strong> {moment.utc(value.date).format('YYYY-MM-DD (ddd)')}</p>
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

    const allCategoriesData = data
        .filter((entry) => moment.utc(entry.date).year() === selectedYear) // Filter using UTC year
        .map((entry) => {
            const totalScore = Object.keys(columnNames).reduce((sum, col) => sum + (entry[col] || 0), 0);
            const avgScore = totalScore / Object.keys(columnNames).length;

            return {
                date: moment.utc(entry.date).format('YYYY-MM-DD'), // Ensure the date remains in UTC
                count: avgScore,
                comment: entry.comment || '',
            };
        });

    const categoryHeatmaps = Object.keys(columnNames).map((col) => {
        const categoryData = data
            .filter((entry) => moment.utc(entry.date).year() === selectedYear) // Filter using UTC year
            .map((entry) => ({
                date: moment.utc(entry.date).format('YYYY-MM-DD'), // Ensure the date remains in UTC
                count: entry[col] || 0, // Use the specific column's value
                comment: entry.comment || '',
            }));

        return { category: columnNames[col], data: categoryData };
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
                                            startDate={startDate}
                                            endDate={endDate}
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
                                            startDate={startDate}
                                            endDate={endDate}
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
