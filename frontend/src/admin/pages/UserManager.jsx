import { useEffect, useState } from "react";
import {
    Table, Button, Modal, Form, Input, Select, Switch, Tag, Space,
    message, Popconfirm, Checkbox, Card,
} from "antd";
import {
    PlusOutlined, ReloadOutlined, DeleteOutlined,
    EditOutlined, LockOutlined, UserOutlined,
} from "@ant-design/icons";
import useUsers from "../hooks/useUsers";
import { useAuth } from "../../shared/context/AuthContext";

const PERMISSIONS = [
    { key: "products", label: "Quản lý sản phẩm" },
    { key: "posts", label: "Quản lý bài viết" },
];

export default function UserManager() {
    const { users, loading, fetchUsers, createUser, updateUser, changePassword, bulkDeleteUsers } = useUsers();
    const { user: currentUser } = useAuth();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    function openCreate() {
        setEditingUser(null);
        form.resetFields();
        form.setFieldsValue({ role: "editor", trangthai: true, permissions: [] });
        setModalOpen(true);
    }

    function openEdit(record) {
        setEditingUser(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            role: record.role,
            trangthai: record.trangthai,
            permissions: record.permissions || [],
        });
        setModalOpen(true);
    }

    function openPasswordModal(record) {
        setEditingUser(record);
        passwordForm.resetFields();
        setPasswordModalOpen(true);
    }

    async function handleSave() {
        try {
            const values = await form.validateFields();
            setSaving(true);

            if (editingUser) {
                const { password, ...updateData } = values;
                await updateUser(editingUser.id, updateData);
                message.success("Cập nhật thành công");
            } else {
                await createUser(values);
                message.success("Tạo user thành công");
            }
            setModalOpen(false);
        } catch (err) {
            if (err.response?.data?.message) {
                message.error(err.response.data.message);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword() {
        try {
            const values = await passwordForm.validateFields();
            setSaving(true);
            await changePassword(editingUser.id, values);
            message.success("Đổi mật khẩu thành công");
            setPasswordModalOpen(false);
        } catch (err) {
            if (err.response?.data?.message) {
                message.error(err.response.data.message);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleBulkDelete() {
        try {
            await bulkDeleteUsers(selectedRowKeys);
            message.success("Xóa thành công");
            setSelectedRowKeys([]);
        } catch (err) {
            if (err.response?.data?.message) {
                message.error(err.response.data.message);
            }
        }
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 60,
        },
        {
            title: "Tên",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            width: 100,
            render: (role) => (
                <Tag color={role === "admin" ? "blue" : "green"}>{role}</Tag>
            ),
        },
        {
            title: "Quyền",
            dataIndex: "permissions",
            width: 240,
            render: (perms) => {
                if (!perms || perms.length === 0) return <span style={{ color: "#999" }}>—</span>;
                return perms.map((p) => {
                    const found = PERMISSIONS.find((x) => x.key === p);
                    return <Tag key={p}>{found?.label || p}</Tag>;
                });
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "trangthai",
            width: 100,
            render: (val) => (
                <Tag color={val ? "success" : "default"}>{val ? "Active" : "Disabled"}</Tag>
            ),
        },
        {
            title: "",
            width: 140,
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    <Button size="small" icon={<LockOutlined />} onClick={() => openPasswordModal(record)} />
                    {record.id !== currentUser?.id && (
                        <Popconfirm title="Xóa user này?" onConfirm={async () => {
                            try {
                                await bulkDeleteUsers([record.id]);
                                message.success("Đã xóa");
                            } catch (err) {
                                message.error(err.response?.data?.message || "Lỗi");
                            }
                        }}>
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const roleValue = Form.useWatch("role", form);

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Toolbar */}
            <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-border-light)",
                background: "var(--color-bg-card)",
                display: "flex",
                gap: 8,
                alignItems: "center",
            }}>
                <Button icon={<PlusOutlined />} type="primary" onClick={openCreate}>
                    Thêm User
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchUsers}>Reload</Button>
                {selectedRowKeys.length > 0 && (
                    <Popconfirm title={`Xóa ${selectedRowKeys.length} user?`} onConfirm={handleBulkDelete}>
                        <Button icon={<DeleteOutlined />} danger>
                            Xóa ({selectedRowKeys.length})
                        </Button>
                    </Popconfirm>
                )}
                <span style={{ marginLeft: "auto", color: "var(--color-text-muted)", fontSize: 13 }}>
                    {users.length} users
                </span>
            </div>

            {/* Table */}
            <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    size="small"
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                        getCheckboxProps: (record) => ({
                            disabled: record.id === currentUser?.id,
                        }),
                    }}
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                title={editingUser ? "Chỉnh sửa User" : "Thêm User mới"}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                confirmLoading={saving}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên" }]}>
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[
                        { required: true, message: "Nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}>
                        <Input />
                    </Form.Item>
                    {!editingUser && (
                        <>
                            <Form.Item name="password" label="Mật khẩu" rules={[
                                { required: true, message: "Nhập mật khẩu" },
                                { min: 6, message: "Tối thiểu 6 ký tự" },
                            ]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item name="password_confirmation" label="Xác nhận mật khẩu" rules={[
                                { required: true, message: "Xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) return Promise.resolve();
                                        return Promise.reject(new Error("Mật khẩu không khớp"));
                                    },
                                }),
                            ]}>
                                <Input.Password />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select options={[
                            { value: "admin", label: "Admin" },
                            { value: "editor", label: "Editor" },
                        ]} />
                    </Form.Item>
                    {roleValue === "editor" && (
                        <Form.Item name="permissions" label="Phân quyền">
                            <Checkbox.Group>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {PERMISSIONS.map((p) => (
                                        <Checkbox key={p.key} value={p.key}>{p.label}</Checkbox>
                                    ))}
                                </div>
                            </Checkbox.Group>
                        </Form.Item>
                    )}
                    {editingUser && (
                        <Form.Item name="trangthai" label="Trạng thái" valuePropName="checked">
                            <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* Password Modal */}
            <Modal
                title={`Đổi mật khẩu — ${editingUser?.name}`}
                open={passwordModalOpen}
                onCancel={() => setPasswordModalOpen(false)}
                onOk={handleChangePassword}
                confirmLoading={saving}
                destroyOnClose
            >
                <Form form={passwordForm} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="password" label="Mật khẩu mới" rules={[
                        { required: true, message: "Nhập mật khẩu mới" },
                        { min: 6, message: "Tối thiểu 6 ký tự" },
                    ]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="password_confirmation" label="Xác nhận mật khẩu" rules={[
                        { required: true, message: "Xác nhận mật khẩu" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) return Promise.resolve();
                                return Promise.reject(new Error("Mật khẩu không khớp"));
                            },
                        }),
                    ]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
