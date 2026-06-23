import { Table, Tag, Switch, Checkbox } from "antd";

const TYPE_COLORS = {
    section: "blue",
    news: "green",
    blog: "purple",
};

const NO_CATEGORY = "(Chưa phân danh mục)";

// Giữ cố định để cột checkbox của header và các bảng nhóm khớp nhau.
const SELECTION_WIDTH = 40;

export default function NoiDungTable({
    items = [],
    loading = false,
    selectedRowKeys = [],
    setSelectedRowKeys,
    onToggleStatus,
}) {
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 60,
        },
        {
            title: "Title",
            dataIndex: "title",
            render: (text) => text || "(No title)",
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 100,
            render: (type) => (
                <Tag color={TYPE_COLORS[type] || "default"}>
                    {type}
                </Tag>
            ),
        },
        {
            title: "Order",
            dataIndex: "thutu",
            width: 70,
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "trangthai",
            width: 80,
            align: "center",
            render: (val, record) => (
                <Switch
                    checked={val === 1 || val === true}
                    size="small"
                    onChange={(checked) => onToggleStatus?.(record.id, checked)}
                />
            ),
        },
        {
            title: "Created",
            dataIndex: "created_at",
            width: 150,
            render: (val) => val ? new Date(val).toLocaleDateString("vi-VN") : "—",
        },
    ];

    // Nhóm content theo danh mục (page_name), giữ nguyên thứ tự xuất hiện.
    const groups = [];
    const indexByName = new Map();
    for (const item of items) {
        const name = item.page_name || NO_CATEGORY;
        if (!indexByName.has(name)) {
            indexByName.set(name, groups.length);
            groups.push({ name, rows: [] });
        }
        groups[indexByName.get(name)].rows.push(item);
    }

    // Khi đang tải hoặc rỗng: hiển thị một bảng đơn (loading/empty state).
    if (loading || groups.length === 0) {
        return (
            <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                loading={loading}
                pagination={false}
                size="small"
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
            />
        );
    }

    // Select-all áp dụng cho toàn bộ content (xuyên mọi nhóm).
    const allIds = items.map((i) => i.id);
    const allSelected =
        allIds.length > 0 && allIds.every((id) => selectedRowKeys.includes(id));
    const someSelected = selectedRowKeys.length > 0 && !allSelected;

    return (
        <div style={{ padding: "0 16px 16px" }}>
            {/* Thanh tiêu đề cột cố định, dùng chung cho mọi nhóm */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    background: "var(--color-bg-card, #fff)",
                }}
            >
                <Table
                    className="noidung-header-only"
                    columns={columns}
                    dataSource={[]}
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                    rowSelection={{
                        columnWidth: SELECTION_WIDTH,
                        columnTitle: (
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={(e) =>
                                    setSelectedRowKeys(
                                        e.target.checked ? allIds : []
                                    )
                                }
                            />
                        ),
                    }}
                />
            </div>

            {groups.map((group) => {
                const groupIds = group.rows.map((r) => r.id);
                const groupSelected = selectedRowKeys.filter(
                    (k) => groupIds.includes(k)
                );

                return (
                    <div key={group.name} style={{ marginBottom: 24 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                                marginBottom: 8,
                                borderLeft: "3px solid var(--color-primary, #2f456f)",
                                background: "var(--color-bg-card, #fafafa)",
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            <span>{group.name}</span>
                            <Tag bordered={false}>{group.rows.length}</Tag>
                        </div>

                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={group.rows}
                            showHeader={false}
                            pagination={false}
                            size="small"
                            tableLayout="fixed"
                            rowSelection={{
                                columnWidth: SELECTION_WIDTH,
                                selectedRowKeys: groupSelected,
                                onChange: (keys) => {
                                    // Gộp lựa chọn của nhóm này với các nhóm khác.
                                    const others = selectedRowKeys.filter(
                                        (k) => !groupIds.includes(k)
                                    );
                                    setSelectedRowKeys([...others, ...keys]);
                                },
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
