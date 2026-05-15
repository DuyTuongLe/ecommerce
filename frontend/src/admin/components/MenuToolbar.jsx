// src/admin/components/MenuToolbar.jsx

import { Button, Select, Space } from "antd";

export default function MenuToolbar({
    language,
    languages,
    onChangeLanguage,

    menuGroup,
    onChangeMenuGroup,
    menuGroups,
    onSave,
    onReload
}) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Space>
                <Select

                    value={language}
                    onChange={onChangeLanguage}
                    style={{
                        width: 140
                    }}
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

                <Button type="primary">
                    Add
                </Button>

                <Button>
                    Edit
                </Button>

                <Button danger>
                    Remove
                </Button>

                <Button>
                    Publish
                </Button>

                <Button>
                    UnPublish
                </Button>
            </Space>
        </div>
    );
}