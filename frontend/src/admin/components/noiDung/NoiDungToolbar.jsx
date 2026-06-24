import { Button, Space, Select, Modal } from "antd";
import {
    PlusOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";

const TYPE_OPTIONS = [
    { label: "All", value: "" },
    { label: "Section", value: "section" },
    { label: "Slide", value: "slide" },
    { label: "News", value: "news" },
    { label: "Blog", value: "blog" },
];

export default function NoiDungToolbar({
    type,
    onTypeChange,
    pages = [],
    danduongId,
    onPageChange,
    selectedRowKeys = [],
    onReload,
    onCreate,
    onEdit,
    onDelete,
}) {
    return (
        <div>
            <div className="admin-sidebar-header">
                <h2>Content</h2>
            </div>
            <div style={{ padding: 16 }}>
                <Space wrap>
                    <Select
                        value={type}
                        onChange={onTypeChange}
                        style={{ width: 130 }}
                        options={TYPE_OPTIONS}
                    />

                    <Select
                        value={danduongId}
                        onChange={onPageChange}
                        style={{ width: 180 }}
                        allowClear
                        placeholder="Filter by page"
                        options={pages}
                    />

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={onReload}
                    >
                        Reload
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onCreate}
                    >
                        Create
                    </Button>

                    <Button
                        icon={<EditOutlined />}
                        disabled={selectedRowKeys.length !== 1}
                        onClick={onEdit}
                    >
                        Edit
                    </Button>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => {
                            Modal.confirm({
                                title: "Delete content?",
                                content: `Delete ${selectedRowKeys.length} selected item(s)?`,
                                okType: "danger",
                                onOk: onDelete,
                            });
                        }}
                    >
                        Delete
                        {selectedRowKeys.length > 0
                            ? ` (${selectedRowKeys.length})`
                            : ""}
                    </Button>
                </Space>
            </div>
        </div>
    );
}
