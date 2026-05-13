// src/admin/components/MenuToolbar.jsx

import { Button, Select, Space } from "antd";

export default function MenuToolbar({
    language,
    onChangeLanguage,

    menuGroup,
    onChangeMenuGroup,
    groups,
onSave }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Space>
                <Select

                    defaultValue="vi"
                    value={language}
                    onChange={onChangeLanguage}
                    style={{
                        width: 140
                    }}
                    options={[

                        {
                            label: "Tiếng Việt",
                            value: "vi"
                        },

                        {
                            label: "English",
                            value: "en"
                        }

                    ]}

                />
                <Select
                    value={menuGroup}
                    onChange={onChangeMenuGroup}
                    style={{ width: 180 }}
                    options={
                        groups.map(group => ({
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
  Save
</Button>
                <Button>
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