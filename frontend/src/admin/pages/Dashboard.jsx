import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Tag, Spin, Segmented } from "antd";
import {
    ShoppingCartOutlined, DollarOutlined,
    ClockCircleOutlined, ShoppingOutlined,
} from "@ant-design/icons";
import api from "../../shared/services/api";

function fmt(v) { return Number(v || 0).toLocaleString("vi-VN"); }

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [chart, setChart] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [chartDays, setChartDays] = useState(30);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get("/admin/dashboard/stats").then((r) => r.data),
            api.get("/admin/dashboard/chart", { params: { days: chartDays } }).then((r) => r.data),
            api.get("/admin/dashboard/top-products").then((r) => r.data),
        ])
            .then(([s, c, t]) => { setStats(s); setChart(c); setTopProducts(t); })
            .finally(() => setLoading(false));
    }, [chartDays]);

    if (loading && !stats) return <div style={{ padding: 40, textAlign: "center" }}><Spin size="large" /></div>;

    const statCards = [
        { title: "Đơn hôm nay", value: stats?.today_orders || 0, icon: <ShoppingCartOutlined />, color: "#1677ff" },
        { title: "Doanh thu hôm nay", value: fmt(stats?.today_revenue) + "đ", icon: <DollarOutlined />, color: "#52c41a" },
        { title: "Đơn tháng này", value: stats?.month_orders || 0, icon: <ShoppingCartOutlined />, color: "#722ed1" },
        { title: "Doanh thu tháng", value: fmt(stats?.month_revenue) + "đ", icon: <DollarOutlined />, color: "#fa8c16" },
        { title: "Chờ xử lý", value: stats?.pending_orders || 0, icon: <ClockCircleOutlined />, color: "#ff4d4f" },
        { title: "Sản phẩm", value: stats?.total_products || 0, icon: <ShoppingOutlined />, color: "#13c2c2" },
    ];

    const maxRevenue = Math.max(...chart.map((d) => d.revenue), 1);

    return (
        <div style={{ padding: 20, overflowY: "auto", height: "100vh" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>Dashboard</h2>

            {/* Stat cards */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                {statCards.map((s, i) => (
                    <Col span={4} key={i}>
                        <Card size="small" style={{ borderRadius: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ fontSize: 24, color: s.color }}>{s.icon}</div>
                                <div>
                                    <div style={{ fontSize: 11, color: "#999" }}>{s.title}</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={16}>
                {/* Revenue chart */}
                <Col span={16}>
                    <Card
                        size="small"
                        title="Doanh thu"
                        extra={
                            <Segmented
                                size="small"
                                value={chartDays}
                                onChange={setChartDays}
                                options={[
                                    { label: "7 ngày", value: 7 },
                                    { label: "30 ngày", value: 30 },
                                    { label: "90 ngày", value: 90 },
                                ]}
                            />
                        }
                        style={{ borderRadius: 8 }}
                    >
                        <div style={{ height: 240, display: "flex", alignItems: "flex-end", gap: 1, padding: "0 0 24px" }}>
                            {chart.map((d, i) => {
                                const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 200 : 0;
                                const date = new Date(d.date);
                                const showLabel = chart.length <= 14 || i % Math.ceil(chart.length / 10) === 0;
                                return (
                                    <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }} title={`${d.date}: ${fmt(d.revenue)}đ (${d.orders} đơn)`}>
                                        <div style={{ width: "100%", maxWidth: 20, height: Math.max(h, 2), background: d.revenue > 0 ? "#1677ff" : "#f0f0f0", borderRadius: "2px 2px 0 0", transition: "height 0.3s" }} />
                                        {showLabel && (
                                            <div style={{ fontSize: 9, color: "#999", marginTop: 4, whiteSpace: "nowrap" }}>
                                                {date.getDate()}/{date.getMonth() + 1}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </Col>

                {/* Top products */}
                <Col span={8}>
                    <Card size="small" title="Sản phẩm bán chạy" style={{ borderRadius: 8 }}>
                        <Table
                            rowKey="id"
                            dataSource={topProducts}
                            size="small"
                            pagination={false}
                            columns={[
                                {
                                    title: "Sản phẩm",
                                    dataIndex: "name",
                                    render: (name, r) => (
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            {r.thumbnail && <img src={r.thumbnail} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover" }} />}
                                            <div style={{ fontSize: 12, lineHeight: 1.3 }}>{name}</div>
                                        </div>
                                    ),
                                },
                                { title: "SL", dataIndex: "total_qty", width: 50, align: "center", render: (v) => <strong>{v}</strong> },
                                { title: "DT", dataIndex: "total_revenue", width: 90, align: "right", render: (v) => <span style={{ fontSize: 11 }}>{fmt(v)}đ</span> },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
