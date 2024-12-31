import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
    LineChartOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export default function Dashboard() {
    // Example data - replace with real data from your backend
    const stats = {
        totalUsers: 1234,
        totalOrders: 89,
        revenue: 15420,
        growth: 23.4,
    };

    return (
        <div>
            <Title level={2}>Dashboard</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Total Orders"
                            value={stats.totalOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Revenue"
                            value={stats.revenue}
                            prefix={<DollarCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                            precision={2}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Growth"
                            value={stats.growth}
                            prefix={<LineChartOutlined />}
                            suffix="%"
                            valueStyle={{ color: '#52c41a' }}
                            precision={1}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Recent Activity"
                        bordered={false}
                        style={{ height: '400px' }}
                    >
                        {/* Add your activity content here */}
                        <p>No recent activity</p>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Performance Overview"
                        bordered={false}
                        style={{ height: '400px' }}
                    >
                        {/* Add your performance chart here */}
                        <p>No data available</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
} 