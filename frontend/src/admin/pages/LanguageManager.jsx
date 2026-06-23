// src/admin/pages/LanguageManager.jsx

import { useEffect, useState, useCallback } from "react";
import {
    Table,
    Button,
    Space,
    Tag,
    Switch,
    Modal,
    message,
} from "antd";
import {
    PlusOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import LanguageFormModal from "../components/language/LanguageFormModal";
import { invalidateLanguagesCache } from "../hooks/useLanguages";
import {
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
} from "../../shared/services/languageApi";

export default function LanguageManager() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editing, setEditing] = useState(null);

    const fetchList = useCallback(async () => {
        invalidateLanguagesCache();
        setLoading(true);
        try {
            const data = await getLanguages(true);
            setItems(data);
        } catch (e) {
            message.error("Không tải được danh sách ngôn ngữ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const openCreate = () => {
        setModalMode("create");
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setModalMode("edit");
        setEditing(record);
        setModalOpen(true);
    };

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            const result = editing
                ? await updateLanguage(editing.id, payload)
                : await createLanguage(payload);

            if (result?.success === false) {
                message.error(result.message || "Lưu thất bại");
                return;
            }

            message.success(editing ? "Đã cập nhật" : "Đã thêm ngôn ngữ");
            setModalOpen(false);
            fetchList();
        } catch (e) {
            message.error(
                e?.response?.data?.message
                || "Lưu thất bại. Kiểm tra lại mã ngôn ngữ (có thể bị trùng)."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (record, checked) => {
        // Optimistic update.
        setItems((prev) =>
            prev.map((it) =>
                it.id === record.id ? { ...it, status: checked ? 1 : 0 } : it
            )
        );
        try {
            await updateLanguage(record.id, {
                code: record.code,
                name: record.name,
                macdinh: record.macdinh,
                status: checked ? 1 : 0,
            });
        } catch (e) {
            message.error(e?.response?.data?.message || "Cập nhật thất bại");
            fetchList();
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Xóa ngôn ngữ?",
            content: `Xóa "${record.name}" (${record.code})?`,
            okType: "danger",
            okText: "Xóa",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const result = await deleteLanguage(record.id);
                    if (result?.success === false) {
                        message.error(result.message || "Xóa thất bại");
                        return;
                    }
                    message.success("Đã xóa");
                    fetchList();
                } catch (e) {
                    message.error(
                        e?.response?.data?.message || "Xóa thất bại"
                    );
                }
            },
        });
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 60,
        },
        {
            title: "Mã",
            dataIndex: "code",
            width: 100,
            render: (code) => <Tag>{code}</Tag>,
        },
        {
            title: "Tên ngôn ngữ",
            dataIndex: "name",
        },
        {
            title: "Mặc định",
            dataIndex: "macdinh",
            width: 110,
            align: "center",
            render: (val) =>
                val === 1 || val === true ? (
                    <Tag color="gold">Mặc định</Tag>
                ) : (
                    <span style={{ color: "#bbb" }}>—</span>
                ),
        },
        {
            title: "Kích hoạt",
            dataIndex: "status",
            width: 100,
            align: "center",
            render: (val, record) => (
                <Switch
                    size="small"
                    checked={val === 1 || val === true}
                    onChange={(checked) => handleToggleStatus(record, checked)}
                />
            ),
        },
        {
            title: "",
            key: "actions",
            width: 110,
            align: "right",
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEdit(record)}
                    />
                    <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={record.macdinh === 1 || record.macdinh === true}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            }}
        >
            <div className="admin-sidebar-header">
                <h2>Languages</h2>
            </div>

            <div style={{ padding: 16 }}>
                <Space wrap>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchList}
                    >
                        Reload
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openCreate}
                    >
                        Thêm ngôn ngữ
                    </Button>
                </Space>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "0 16px 16px" }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                    pagination={false}
                    size="small"
                />
            </div>

            <LanguageFormModal
                open={modalOpen}
                mode={modalMode}
                initialValues={editing}
                confirmLoading={saving}
                onSubmit={handleSubmit}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}
