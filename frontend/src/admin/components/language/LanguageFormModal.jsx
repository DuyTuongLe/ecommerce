// src/admin/components/language/LanguageFormModal.jsx

import { useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";

export default function LanguageFormModal({
    open,
    mode = "create",
    initialValues,
    confirmLoading = false,
    onSubmit,
    onCancel,
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            return;
        }

        if (mode === "edit" && initialValues) {
            form.setFieldsValue({
                code: initialValues.code,
                name: initialValues.name,
                macdinh: !!initialValues.macdinh,
                status: initialValues.status === undefined
                    ? true
                    : !!initialValues.status,
            });
        } else {
            form.setFieldsValue({
                code: "",
                name: "",
                macdinh: false,
                status: true,
            });
        }
    }, [open, mode, initialValues, form]);

    const isDefault = mode === "edit" && !!initialValues?.macdinh;

    return (
        <Modal
            open={open}
            title={mode === "edit" ? "Sửa ngôn ngữ" : "Thêm ngôn ngữ"}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            onOk={async () => {
                const values = await form.validateFields();
                onSubmit({
                    code: values.code.trim(),
                    name: values.name.trim(),
                    macdinh: values.macdinh ? 1 : 0,
                    status: values.status ? 1 : 0,
                });
            }}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Mã (code)"
                    name="code"
                    rules={[
                        { required: true, message: "Vui lòng nhập mã ngôn ngữ" },
                        {
                            pattern: /^[a-zA-Z-]+$/,
                            message: "Chỉ gồm chữ cái và dấu gạch ngang (vd: vi, en, zh-CN)",
                        },
                    ]}
                    extra="Mã chuẩn ISO, ví dụ: vi, en, ja..."
                >
                    <Input placeholder="vi" />
                </Form.Item>

                <Form.Item
                    label="Tên ngôn ngữ"
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên ngôn ngữ" },
                    ]}
                >
                    <Input placeholder="Tiếng Việt" />
                </Form.Item>

                <Form.Item
                    label="Mặc định"
                    name="macdinh"
                    valuePropName="checked"
                    extra={
                        isDefault
                            ? "Đây đang là ngôn ngữ mặc định. Đặt ngôn ngữ khác làm mặc định để thay đổi."
                            : "Bật để đặt làm ngôn ngữ mặc định (các ngôn ngữ khác sẽ tự bỏ mặc định)."
                    }
                >
                    <Switch disabled={isDefault} />
                </Form.Item>

                <Form.Item
                    label="Kích hoạt"
                    name="status"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}
