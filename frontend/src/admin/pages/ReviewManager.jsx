import { useEffect, useState, useCallback, useRef } from "react";
import {
    Table, Tag, Input, Select, Button, Space, Rate, message, Modal, Tooltip,
} from "antd";
import {
    ReloadOutlined, DeleteOutlined, CheckOutlined,
    CloseOutlined, SearchOutlined, StarOutlined,
} from "@ant-design/icons";
import api from "../../shared/services/api";

function fmtDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ReviewManager() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(undefined);
    const [page, setPage] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const filtersRef = useRef({ search, status, page });
    filtersRef.current = { search, status, page };

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            const { data: res } = await api.get("/admin/reviews", {
                params: { search: filtersRef.current.search, status: filtersRef.current.status, page: filtersRef.current.page },
            });
            setData(res);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { reload(); }, [search, status, page, reload]);

    async function handleAction(action, ids) {
        if (action === "delete") {
            Modal.confirm({
                title: "Xóa đánh giá",
                content: `Xóa ${ids.length} đánh giá?`,
                okText: "Xóa", okType: "danger", cancelText: "Hủy",
                onOk: async () => {
                    await api.post("/admin/reviews/bulk-action", { ids, action: "delete" });
                    message.success("Đã xóa");
                    setSelectedRowKeys([]);
                    reload();
                },
            });
            return;
        }
        await api.post("/admin/reviews/bulk-action", { ids, action });
        message.success(action === "approve" ? "Đã duyệt" : "Đã ẩn");
        setSelectedRowKeys([]);
        reload();
    }

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "product_name",
            width: 200,
            render: (name, r) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{name || "—"}</div>
                    {r.product_sku && <div style={{ fontSize: 11, color: "#999" }}>SKU: {r.product_sku}</div>}
                </div>
            ),
        },
        {
            title: "Rating",
            dataIndex: "rating",
            width: 130,
            render: (v) => <Rate disabled value={v} style={{ fontSize: 13 }} />,
        },
        {
            title: "Nội dung",
            render: (_, r) => (
                <div>
                    {r.title && <div style={{ fontWeight: 500, marginBottom: 2 }}>{r.title}</div>}
                    <div style={{ fontSize: 13, color: "#555", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.content}</div>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 100,
            render: (s) => s ? <Tag color="green">Hiện</Tag> : <Tag color="gold">Chờ duyệt</Tag>,
        },
        {
            title: "Ngày",
            dataIndex: "created_at",
            width: 140,
            render: fmtDate,
        },
        {
            title: "",
            width: 100,
            render: (_, r) => (
                <Space size={4}>
                    {!r.status && (
                        <Tooltip title="Duyệt">
                            <Button size="small" type="text" icon={<CheckOutlined style={{ color: "#52c41a" }} />} onClick={() => handleAction("approve", [r.id])} />
                        </Tooltip>
                    )}
                    {r.status === 1 && (
                        <Tooltip title="Ẩn">
                            <Button size="small" type="text" icon={<CloseOutlined style={{ color: "#fa8c16" }} />} onClick={() => handleAction("reject", [r.id])} />
                        </Tooltip>
                    )}
                    <Tooltip title="Xóa">
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleAction("delete", [r.id])} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const pagination = data ? {
        current: data.current_page, total: data.total, pageSize: data.per_page,
        showSizeChanger: false, onChange: (p) => setPage(p),
    } : false;

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--color-border)",
                background: "var(--color-bg-card)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
                <StarOutlined style={{ fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>Đánh giá</span>

                <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} allowClear style={{ width: 200 }}
                    value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />

                <Select placeholder="Trạng thái" allowClear style={{ width: 140 }}
                    value={status} onChange={(v) => { setStatus(v); setPage(1); }}
                    options={[{ value: 0, label: "Chờ duyệt" }, { value: 1, label: "Đã duyệt" }]} />

                <Button icon={<ReloadOutlined />} onClick={() => { reload(); setSelectedRowKeys([]); }}>Tải lại</Button>

                {selectedRowKeys.length > 0 && (
                    <Space>
                        <Button icon={<CheckOutlined />} onClick={() => handleAction("approve", selectedRowKeys)}>Duyệt ({selectedRowKeys.length})</Button>
                        <Button danger icon={<DeleteOutlined />} onClick={() => handleAction("delete", selectedRowKeys)}>Xóa ({selectedRowKeys.length})</Button>
                    </Space>
                )}
            </div>

            <div style={{ flex: 1, overflow: "auto" }}>
                <Table rowKey="id" columns={columns} dataSource={data?.data || []} loading={loading}
                    pagination={pagination} rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} size="middle" />
            </div>
        </div>
    );
}
