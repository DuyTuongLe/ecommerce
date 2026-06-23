// src/admin/components/MenuGroupModal.jsx

import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

export default function MenuGroupModal({
    open,
    mode = "create",
    initialValues,
    confirmLoading = false,
    onSubmit,
    onCancel,
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initialValues) {
            form.setFieldsValue({
                danduong_nhom_ten: initialValues.danduong_nhom_ten,
                danduong_nhom_tieude: initialValues.danduong_nhom_tieude,
            });
        } else {
            form.resetFields();
        }
    }, [open, mode, initialValues, form]);

    return (
        <Modal
            open={open}
            title={mode === "edit" ? "Sửa nhóm menu" : "Thêm nhóm menu"}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            onOk={async () => {
                const values = await form.validateFields();
                onSubmit({
                    danduong_nhom_ten: values.danduong_nhom_ten.trim(),
                    danduong_nhom_tieude: values.danduong_nhom_tieude.trim(),
                });
            }}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên (code)"
                    name="danduong_nhom_ten"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhóm" }]}
                    extra="Tên hệ thống dùng nội bộ, vd: main_menu, footer_menu"
                >
                    <Input placeholder="footer_menu" />
                </Form.Item>

                <Form.Item
                    label="Tiêu đề hiển thị"
                    name="danduong_nhom_tieude"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                    <Input placeholder="Menu Footer" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
