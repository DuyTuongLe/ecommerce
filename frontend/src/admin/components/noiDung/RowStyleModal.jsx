import { useState } from "react";
import { Modal, Input } from "antd";

function hasClass(classes, val) {
    return (" " + (classes || "") + " ").includes(" " + val + " ");
}

function toggleClass(classes, val) {
    const list = (classes || "").split(/\s+/).filter(Boolean);
    if (list.includes(val)) return list.filter((c) => c !== val).join(" ");
    return [...list, val].join(" ");
}

function ClassButtons({ items, classes, onToggle }) {
    return (
        <div className="ge-style-buttons">
            {items.map((item) => (
                <span
                    key={item.value}
                    className={`ge-style-btn ${hasClass(classes, item.value) ? "active" : ""}`}
                    onClick={() => onToggle(item.value)}
                >
                    {item.label}
                </span>
            ))}
        </div>
    );
}

const TABS = [
    { key: "custom", label: "Custom" },
    {
        key: "display", label: "Hiển thị", groups: [
            { title: "Display", items: [
                { label: "Flex", value: "flex" },
                { label: "Block", value: "block" },
                { label: "Grid", value: "grid" },
                { label: "Ẩn", value: "hidden" },
            ]},
            { title: "Flex Direction", items: [
                { label: "Hàng ngang", value: "flex-row" },
                { label: "Cột dọc", value: "flex-col" },
                { label: "Ngắt dòng", value: "flex-wrap" },
            ]},
        ],
    },
    {
        key: "justify", label: "Căn chỉnh", groups: [
            { title: "Justify Content", items: [
                { label: "Căn trái", value: "justify-start" },
                { label: "Căn giữa", value: "justify-center" },
                { label: "Căn phải", value: "justify-end" },
                { label: "Căn đều (between)", value: "justify-between" },
                { label: "Căn đều (around)", value: "justify-around" },
                { label: "Căn đều (evenly)", value: "justify-evenly" },
            ]},
            { title: "Align Items", items: [
                { label: "Căn trên", value: "items-start" },
                { label: "Căn giữa", value: "items-center" },
                { label: "Căn dưới", value: "items-end" },
                { label: "Stretch", value: "items-stretch" },
            ]},
        ],
    },
    {
        key: "spacing", label: "Khoảng cách", groups: [
            { title: "Gap", items: [
                { label: "0", value: "gap-0" },
                { label: "Nhỏ", value: "gap-1" },
                { label: "Vừa", value: "gap-2" },
                { label: "Trung bình", value: "gap-3" },
                { label: "Lớn", value: "gap-4" },
                { label: "Rất lớn", value: "gap-6" },
                { label: "Cực lớn", value: "gap-8" },
            ]},
            { title: "Padding", items: [
                { label: "p-0", value: "p-0" },
                { label: "p-2", value: "p-2" },
                { label: "p-4", value: "p-4" },
                { label: "p-6", value: "p-6" },
                { label: "p-8", value: "p-8" },
            ]},
        ],
    },
    {
        key: "bg", label: "Nền & Viền", groups: [
            { title: "Màu nền", items: [
                { label: "White", value: "bg-white" },
                { label: "Gray", value: "bg-gray-100" },
                { label: "Slate", value: "bg-slate-100" },
                { label: "Blue", value: "bg-blue-50" },
                { label: "Green", value: "bg-green-50" },
                { label: "Red", value: "bg-red-50" },
                { label: "Black", value: "bg-black" },
            ]},
            { title: "Bo góc", items: [
                { label: "Không", value: "rounded-none" },
                { label: "Nhỏ", value: "rounded" },
                { label: "Vừa", value: "rounded-md" },
                { label: "Lớn", value: "rounded-lg" },
                { label: "Rất lớn", value: "rounded-xl" },
            ]},
            { title: "Đổ bóng", items: [
                { label: "Không", value: "shadow-none" },
                { label: "Nhỏ", value: "shadow-sm" },
                { label: "Vừa", value: "shadow" },
                { label: "Lớn", value: "shadow-md" },
                { label: "Rất lớn", value: "shadow-lg" },
            ]},
        ],
    },
];

export default function RowStyleModal({ open, style = {}, onSave, onCancel }) {
    const [tab, setTab] = useState("custom");
    const [localStyle, setLocalStyle] = useState(style);

    function set(key, val) {
        setLocalStyle((prev) => ({ ...prev, [key]: val }));
    }

    function toggleCls(val) {
        set("classes", toggleClass(localStyle.classes, val));
    }

    const cls = localStyle.classes || "";
    const activeTab = TABS.find((t) => t.key === tab);

    return (
        <Modal
            open={open}
            title="Row Settings"
            width={680}
            onCancel={onCancel}
            onOk={() => onSave(localStyle)}
            okText="Áp dụng"
        >
            <div className="ge-style-tabs">
                {TABS.map((t) => (
                    <div
                        key={t.key}
                        className={`ge-style-tab ${tab === t.key ? "active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </div>
                ))}
            </div>

            {activeTab?.key === "custom" && (
                <div>
                    <div className="ge-style-group-title">Element ID</div>
                    <Input
                        value={localStyle.id || ""}
                        onChange={(e) => set("id", e.target.value)}
                        placeholder="Nhập ID duy nhất"
                        style={{ marginBottom: 12 }}
                    />
                    <div className="ge-style-group-title">Custom CSS Classes</div>
                    <Input
                        value={localStyle.classes || ""}
                        onChange={(e) => set("classes", e.target.value)}
                        placeholder="vd: container mx-auto py-8"
                    />
                </div>
            )}

            {activeTab?.groups && (
                <div>
                    {activeTab.groups.map((group) => (
                        <div key={group.title}>
                            <div className="ge-style-group-title">{group.title}</div>
                            <ClassButtons items={group.items} classes={cls} onToggle={toggleCls} />
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}
