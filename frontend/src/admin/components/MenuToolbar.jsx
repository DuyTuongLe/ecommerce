// src/admin/components/MenuToolbar.jsx

import { Button, Select, Space, Tooltip } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

export default function MenuToolbar({
    language,
    languages,
    onChangeLanguage,

    menuGroup,
    onChangeMenuGroup,
    menuGroups,
    onSave,
    onReload,
    onAdd,
    onRemove,

    onAddGroup,
    onEditGroup,
    onDeleteGroup,
}) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Space>
                <Select
                    value={language}
                    onChange={onChangeLanguage}
                    style={{ width: 140 }}
                    options={
                        languages.map(lang => ({
                            label: lang.name,
                            value: lang.code
                        }))
                    }
                />

                <Select
                    value={menuGroup}
                    onChange={onChangeMenuGroup}
                    style={{ width: 180 }}
                    options={
                        menuGroups.map(group => ({
                            label: group.danduong_nhom_tieude,
                            value: group.id
                        }))
                    }
                />

                <Tooltip title="Thêm nhóm">
                    <Button
                        size="small"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={onAddGroup}
                    />
                </Tooltip>

                <Tooltip title="Sửa nhóm đang chọn">
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        disabled={!menuGroup}
                        onClick={onEditGroup}
                    />
                </Tooltip>

                <Tooltip title="Xóa nhóm đang chọn">
                    <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={!menuGroup}
                        onClick={onDeleteGroup}
                    />
                </Tooltip>
            </Space>

            <Space>
                <Button
                    type="primary"
                    onClick={onSave}
                >
                    Save Menu
                </Button>
                <Button onClick={onReload}>
                    Reload
                </Button>

                <Button type="primary" onClick={onAdd}>
                    Add
                </Button>

                <Button
                    danger
                    onClick={onRemove}
                >
                    Remove
                </Button>
            </Space>
        </div>
    );
}
