import { Table, Tag, Switch } from "antd";

const TYPE_COLORS = {
    section: "blue",
    news: "green",
    blog: "purple",
};

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
            title: "Page",
            dataIndex: "page_name",
            width: 160,
            render: (text) => text || "—",
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
