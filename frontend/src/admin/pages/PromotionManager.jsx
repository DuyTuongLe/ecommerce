import { useEffect, useState, useCallback, useRef } from "react";
import {
    Table, Tag, Input, Select, Button, Space, Modal, Form,
    InputNumber, DatePicker, Switch, message, Tooltip, Badge,
} from "antd";
import {
    ReloadOutlined, DeleteOutlined, PlusOutlined,
    EditOutlined, SearchOutlined, GiftOutlined, CopyOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
    getPromotions, createPromotion, updatePromotion,
    deletePromotion, bulkDeletePromotions,
} from "../../shared/services/promotionApi";

const TYPE_OPTIONS = [
    { value: "percent", label: "Giảm %" },
    { value: "fixed", label: "Giảm tiền cố định" },
];

function fmt(v) {
    if (v == null) return "0";
    return Number(v).toLocaleString("vi-VN");
}

function fmtDate(d) {
    if (!d) return "—";
    return dayjs(d).format("DD/MM/YYYY HH:mm");
}

function promoStatus(promo) {
    if (!promo.status) return { color: "default", text: "Tắt" };
    const now = dayjs();
    if (promo.start_at && now.isBefore(dayjs(promo.start_at))) return { color: "blue", text: "Sắp diễn ra" };
    if (promo.end_at && now.isAfter(dayjs(promo.end_at))) return { color: "red", text: "Hết hạn" };
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) return { color: "red", text: "Hết lượt" };
    return { color: "green", text: "Hoạt động" };
}

export default function PromotionManager() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    const filtersRef = useRef({ search, page });
    filtersRef.current = { search, page };

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPromotions({
                search: filtersRef.current.search,
                page: filtersRef.current.page,
            });
            setData(res);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { reload(); }, [search, page, reload]);

    function openCreate() {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({
            type: "percent",
            value: 10,
            minimum_order_value: 0,
            usage_limit: null,
            status: true,
            start_at: null,
            end_at: null,
        });
        setModalOpen(true);
    }

    function openEdit(record) {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            start_at: record.start_at ? dayjs(record.start_at) : null,
            end_at: record.end_at ? dayjs(record.end_at) : null,
        });
        setModalOpen(true);
    }

    async function handleSave() {
        try {
            const values = await form.validateFields();
            setSaving(true);

            const payload = {
                ...values,
                code: values.code?.toUpperCase(),
                start_at: values.start_at?.format("YYYY-MM-DD HH:mm:ss") || null,
                end_at: values.end_at?.format("YYYY-MM-DD HH:mm:ss") || null,
            };

            if (editingId) {
                await updatePromotion(editingId, payload);
                message.success("Cập nhật thành công");
            } else {
                await createPromotion(payload);
                message.success("Tạo mã thành công");
            }

            setModalOpen(false);
            reload();
        } catch (err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const fields = Object.entries(errors).map(([name, msgs]) => ({
                    name, errors: msgs,
                }));
                form.setFields(fields);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(ids) {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Xóa ${ids.length} mã giảm giá?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                if (ids.length === 1) {
                    await deletePromotion(ids[0]);
                } else {
                    await bulkDeletePromotions(ids);
                }
                message.success("Đã xóa");
                setSelectedRowKeys([]);
                reload();
            },
        });
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        message.success(`Đã copy: ${code}`);
    }

    const columns = [
        {
            title: "Mã",
            dataIndex: "code",
            width: 160,
            render: (code) => (
                <Space>
                    <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 14 }}>{code}</span>
                    <Tooltip title="Copy">
                        <CopyOutlined style={{ color: "#999", cursor: "pointer" }} onClick={() => copyCode(code)} />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: "Loại",
            dataIndex: "type",
            width: 140,
            render: (type, record) => (
                <span style={{ fontWeight: 500 }}>
                    {type === "percent"
                        ? `Giảm ${record.value}%`
                        : `Giảm ${fmt(record.value)}đ`}
                </span>
            ),
        },
        {
            title: "Đơn tối thiểu",
            dataIndex: "minimum_order_value",
            width: 140,
            align: "right",
            render: (v) => v > 0 ? `${fmt(v)}đ` : "—",
        },
        {
            title: "Sử dụng",
            width: 100,
            align: "center",
            render: (_, record) => (
                <span>
                    {record.used_count || 0}
                    {record.usage_limit ? ` / ${record.usage_limit}` : ""}
                </span>
            ),
        },
        {
            title: "Thời gian",
            width: 200,
            render: (_, record) => (
                <div style={{ fontSize: 12 }}>
                    <div>Từ: {fmtDate(record.start_at)}</div>
                    <div>Đến: {fmtDate(record.end_at)}</div>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            width: 120,
            render: (_, record) => {
                const s = promoStatus(record);
                return <Tag color={s.color}>{s.text}</Tag>;
            },
        },
        {
            title: "",
            width: 80,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Sửa">
                        <Button size="small" type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete([record.id])} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const pagination = data ? {
        current: data.current_page,
        total: data.total,
        pageSize: data.per_page,
        showSizeChanger: false,
        showTotal: (total) => `${total} mã giảm giá`,
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
                <GiftOutlined style={{ fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>Mã giảm giá</span>

                <Input
                    placeholder="Tìm mã..."
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ width: 200 }}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />

                <Button icon={<ReloadOutlined />} onClick={() => { reload(); setSelectedRowKeys([]); }}>
                    Tải lại
                </Button>

                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                    Tạo mã
                </Button>

                {selectedRowKeys.length > 0 && (
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(selectedRowKeys)}>
                        Xóa ({selectedRowKeys.length})
                    </Button>
                )}
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflow: "auto" }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data?.data || []}
                    loading={loading}
                    pagination={pagination}
                    rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                    size="middle"
                    scroll={{ x: 960 }}
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                title={editingId ? "Sửa mã giảm giá" : "Tạo mã giảm giá"}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                confirmLoading={saving}
                okText="Lưu"
                cancelText="Hủy"
                width={520}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="code"
                        label="Mã giảm giá"
                        rules={[{ required: true, message: "Nhập mã" }]}
                    >
                        <Input
                            placeholder="VD: SALE20, FREESHIP..."
                            style={{ textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}
                        />
                    </Form.Item>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Form.Item
                            name="type"
                            label="Loại giảm"
                            rules={[{ required: true }]}
                        >
                            <Select options={TYPE_OPTIONS} />
                        </Form.Item>

                        <Form.Item
                            name="value"
                            label="Giá trị"
                            rules={[{ required: true, message: "Nhập giá trị" }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(v) => v.replace(/,/g, "")}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="minimum_order_value" label="Giá trị đơn tối thiểu">
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="0 = không giới hạn"
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(v) => v.replace(/,/g, "")}
                        />
                    </Form.Item>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Form.Item name="start_at" label="Bắt đầu">
                            <DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" />
                        </Form.Item>
                        <Form.Item name="end_at" label="Kết thúc">
                            <DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" />
                        </Form.Item>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Form.Item name="usage_limit" label="Giới hạn lượt dùng">
                            <InputNumber min={0} style={{ width: "100%" }} placeholder="Trống = không giới hạn" />
                        </Form.Item>
                        <Form.Item name="status" label="Kích hoạt" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
