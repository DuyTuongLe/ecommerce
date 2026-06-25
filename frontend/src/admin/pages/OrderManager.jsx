import { useEffect, useState, useCallback, useRef } from "react";
import {
    Table, Tag, Input, Select, Button, Space, Drawer,
    Descriptions, Timeline, Divider, message, Modal,
    Card, Badge, Statistic, Row, Col, Tooltip,
} from "antd";
import {
    ReloadOutlined, DeleteOutlined, EyeOutlined,
    SearchOutlined, ShoppingCartOutlined,
} from "@ant-design/icons";
import useOrders from "../hooks/useOrders";

const ORDER_STATUSES = [
    { value: "pending", label: "Chờ xử lý", color: "gold" },
    { value: "confirmed", label: "Đã xác nhận", color: "blue" },
    { value: "processing", label: "Đang xử lý", color: "cyan" },
    { value: "shipping", label: "Đang giao", color: "geekblue" },
    { value: "delivered", label: "Đã giao", color: "green" },
    { value: "cancelled", label: "Đã hủy", color: "red" },
];

const PAYMENT_STATUSES = [
    { value: "pending", label: "Chưa thanh toán", color: "gold" },
    { value: "paid", label: "Đã thanh toán", color: "green" },
    { value: "refunded", label: "Hoàn tiền", color: "red" },
];

function statusColor(status, list) {
    return list.find((s) => s.value === status)?.color || "default";
}

function statusLabel(status, list) {
    return list.find((s) => s.value === status)?.label || status;
}

function formatMoney(val) {
    if (val == null) return "0";
    return Number(val).toLocaleString("vi-VN");
}

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

export default function OrderManager() {
    const {
        orders, loading, detail, detailLoading,
        fetchOrders, fetchDetail, updateStatus,
        removeOrder, bulkRemove, setDetail,
    } = useOrders();

    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState(undefined);
    const [paymentStatus, setPaymentStatus] = useState(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [page, setPage] = useState(1);

    const filtersRef = useRef({ search, orderStatus, paymentStatus, page });
    filtersRef.current = { search, orderStatus, paymentStatus, page };

    const reload = useCallback(() => {
        const f = filtersRef.current;
        fetchOrders({
            search: f.search,
            order_status: f.orderStatus,
            payment_status: f.paymentStatus,
            page: f.page,
        });
    }, [fetchOrders]);

    useEffect(() => { reload(); }, [search, orderStatus, paymentStatus, page, reload]);

    function openDetail(record) {
        fetchDetail(record.id);
        setDrawerOpen(true);
    }

    async function handleStatusChange(field, value) {
        if (!detail) return;
        const res = await updateStatus(detail.id, { [field]: value });
        if (res?.success) {
            message.success("Cập nhật thành công");
            reload();
        }
    }

    async function handleDelete(ids) {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Xóa ${ids.length} đơn hàng? Chỉ đơn chờ xử lý / đã hủy mới xóa được.`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                if (ids.length === 1) {
                    const res = await removeOrder(ids[0]);
                    if (res?.success) {
                        message.success("Đã xóa");
                        reload();
                        setSelectedRowKeys([]);
                        if (detail?.id === ids[0]) { setDrawerOpen(false); setDetail(null); }
                    } else {
                        message.error("Không thể xóa đơn hàng này");
                    }
                } else {
                    const res = await bulkRemove(ids);
                    if (res) {
                        message.success(`Đã xóa ${res.deleted} đơn` + (res.skipped ? `, bỏ qua ${res.skipped}` : ""));
                        reload();
                        setSelectedRowKeys([]);
                    }
                }
            },
        });
    }

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "order_code",
            width: 180,
            render: (text, record) => (
                <a onClick={() => openDetail(record)} style={{ fontWeight: 500 }}>{text}</a>
            ),
        },
        {
            title: "Khách hàng",
            dataIndex: "customer_name",
            width: 180,
            render: (name, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{record.customer_phone}</div>
                </div>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "grand_total",
            width: 130,
            align: "right",
            render: (val) => <span style={{ fontWeight: 600 }}>{formatMoney(val)}đ</span>,
        },
        {
            title: "Trạng thái",
            dataIndex: "order_status",
            width: 140,
            render: (status) => (
                <Tag color={statusColor(status, ORDER_STATUSES)}>
                    {statusLabel(status, ORDER_STATUSES)}
                </Tag>
            ),
        },
        {
            title: "Thanh toán",
            dataIndex: "payment_status",
            width: 140,
            render: (status) => (
                <Tag color={statusColor(status, PAYMENT_STATUSES)}>
                    {statusLabel(status, PAYMENT_STATUSES)}
                </Tag>
            ),
        },
        {
            title: "Phương thức",
            dataIndex: "payment_method",
            width: 110,
            render: (val) => val?.toUpperCase() || "—",
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            width: 160,
            render: formatDate,
        },
        {
            title: "",
            width: 80,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Chi tiết">
                        <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => openDetail(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete([record.id])} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const pagination = orders ? {
        current: orders.current_page,
        total: orders.total,
        pageSize: orders.per_page,
        showSizeChanger: false,
        showTotal: (total) => `${total} đơn hàng`,
        onChange: (p) => setPage(p),
    } : false;

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Toolbar */}
            <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-bg-card)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
            }}>
                <ShoppingCartOutlined style={{ fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>Đơn hàng</span>

                <Input
                    placeholder="Tìm mã đơn, tên, SĐT..."
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ width: 240 }}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />

                <Select
                    placeholder="Trạng thái đơn"
                    allowClear
                    style={{ width: 160 }}
                    value={orderStatus}
                    onChange={(v) => { setOrderStatus(v); setPage(1); }}
                    options={ORDER_STATUSES}
                />

                <Select
                    placeholder="Thanh toán"
                    allowClear
                    style={{ width: 160 }}
                    value={paymentStatus}
                    onChange={(v) => { setPaymentStatus(v); setPage(1); }}
                    options={PAYMENT_STATUSES}
                />

                <Button icon={<ReloadOutlined />} onClick={() => { reload(); setSelectedRowKeys([]); }}>
                    Tải lại
                </Button>

                {selectedRowKeys.length > 0 && (
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(selectedRowKeys)}>
                        Xóa ({selectedRowKeys.length})
                    </Button>
                )}

                {orders?.total != null && (
                    <span style={{ marginLeft: "auto", fontSize: 13, color: "#999" }}>
                        Tổng: {orders.total} đơn
                    </span>
                )}
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflow: "auto" }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={orders?.data || []}
                    loading={loading}
                    pagination={pagination}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                    size="middle"
                    scroll={{ x: 1100 }}
                />
            </div>

            {/* Detail Drawer */}
            <Drawer
                title={detail ? `Đơn hàng ${detail.order_code}` : "Chi tiết đơn hàng"}
                open={drawerOpen}
                onClose={() => { setDrawerOpen(false); setDetail(null); }}
                width={640}
                loading={detailLoading}
            >
                {detail && <OrderDetail detail={detail} onStatusChange={handleStatusChange} />}
            </Drawer>
        </div>
    );
}

function OrderDetail({ detail, onStatusChange }) {
    return (
        <div>
            {/* Summary stats */}
            <Row gutter={12} style={{ marginBottom: 20 }}>
                <Col span={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng tiền"
                            value={Number(detail.grand_total)}
                            suffix="đ"
                            valueStyle={{ fontSize: 20, fontWeight: 700, color: "#1677ff" }}
                            formatter={(v) => formatMoney(v)}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small">
                        <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Trạng thái đơn</div>
                        <Select
                            value={detail.order_status}
                            onChange={(v) => onStatusChange("order_status", v)}
                            options={ORDER_STATUSES}
                            style={{ width: "100%" }}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small">
                        <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Thanh toán</div>
                        <Select
                            value={detail.payment_status}
                            onChange={(v) => onStatusChange("payment_status", v)}
                            options={PAYMENT_STATUSES}
                            style={{ width: "100%" }}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Customer info */}
            <Descriptions
                title="Thông tin khách hàng"
                column={2}
                size="small"
                bordered
                style={{ marginBottom: 20 }}
            >
                <Descriptions.Item label="Họ tên">{detail.customer_name}</Descriptions.Item>
                <Descriptions.Item label="Điện thoại">{detail.customer_phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{detail.customer_email || "—"}</Descriptions.Item>
                <Descriptions.Item label="Thanh toán">{detail.payment_method?.toUpperCase()}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                    {[detail.shipping_address, detail.shipping_ward, detail.shipping_district, detail.shipping_city]
                        .filter(Boolean).join(", ")}
                </Descriptions.Item>
                {detail.note && (
                    <Descriptions.Item label="Ghi chú" span={2}>
                        {detail.note}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Items */}
            <h4 style={{ marginBottom: 10 }}>Sản phẩm ({detail.items?.length || 0})</h4>
            <Table
                rowKey="id"
                dataSource={detail.items || []}
                size="small"
                pagination={false}
                columns={[
                    {
                        title: "Sản phẩm",
                        dataIndex: "product_name",
                        render: (name, record) => (
                            <div>
                                <div style={{ fontWeight: 500 }}>{name}</div>
                                {record.product_sku && <div style={{ fontSize: 11, color: "#999" }}>SKU: {record.product_sku}</div>}
                            </div>
                        ),
                    },
                    {
                        title: "Giá",
                        dataIndex: "price",
                        width: 120,
                        align: "right",
                        render: (v) => formatMoney(v) + "đ",
                    },
                    {
                        title: "SL",
                        dataIndex: "qty",
                        width: 60,
                        align: "center",
                    },
                    {
                        title: "Thành tiền",
                        dataIndex: "total",
                        width: 130,
                        align: "right",
                        render: (v) => <strong>{formatMoney(v)}đ</strong>,
                    },
                ]}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3} align="right">
                            <strong>Tổng cộng:</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                            <strong style={{ color: "#1677ff", fontSize: 15 }}>
                                {formatMoney(detail.grand_total)}đ
                            </strong>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />

            {/* History */}
            {detail.histories?.length > 0 && (
                <>
                    <Divider />
                    <h4 style={{ marginBottom: 10 }}>Lịch sử</h4>
                    <Timeline
                        items={detail.histories.map((h) => ({
                            color: h.new_status === "cancelled" ? "red" : h.new_status === "delivered" ? "green" : "blue",
                            children: (
                                <div>
                                    <div>
                                        {h.old_status && (
                                            <Tag color="default" style={{ fontSize: 11 }}>{h.old_status}</Tag>
                                        )}
                                        {h.old_status && " → "}
                                        <Tag color={statusColor(h.new_status, [...ORDER_STATUSES, ...PAYMENT_STATUSES])} style={{ fontSize: 11 }}>
                                            {statusLabel(h.new_status, [...ORDER_STATUSES, ...PAYMENT_STATUSES])}
                                        </Tag>
                                    </div>
                                    {h.note && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{h.note}</div>}
                                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{formatDate(h.created_at)}</div>
                                </div>
                            ),
                        }))}
                    />
                </>
            )}
        </div>
    );
}
