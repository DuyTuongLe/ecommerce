import { useState } from "react";
import { Modal, Input } from "antd";

const TABS = [
    { key: "custom", label: "Custom" },
    { key: "layout", label: "Layout" },
    { key: "margin", label: "Margin" },
    { key: "padding", label: "Padding" },
    { key: "border", label: "Border" },
    { key: "radius", label: "Bo Goc" },
    { key: "shadow", label: "Shadow" },
];

const LAYOUT_GROUPS = [
    {
        title: "Display", items: [
            { label: "Flex", value: "flex" },
            { label: "Block", value: "block" },
            { label: "Inline Block", value: "inline-block" },
        ]
    },
    {
        title: "Flex Direction", items: [
            { label: "Row", value: "flex-row" },
            { label: "Column", value: "flex-col" },
        ]
    },
    {
        title: "Justify Content", items: [
            { label: "Start", value: "justify-start" },
            { label: "Center", value: "justify-center" },
            { label: "End", value: "justify-end" },
            { label: "Between", value: "justify-between" },
            { label: "Around", value: "justify-around" },
        ]
    },
    {
        title: "Align Items", items: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
            { label: "Stretch", value: "items-stretch" },
        ]
    },
    {
        title: "Text Align", items: [
            { label: "Left", value: "text-left" },
            { label: "Center", value: "text-center" },
            { label: "Right", value: "text-right" },
        ]
    },
];

const SIZES = [
    { label: "0", value: "0" },
    { label: "1 (4px)", value: "1" },
    { label: "2 (8px)", value: "2" },
    { label: "3 (12px)", value: "3" },
    { label: "4 (16px)", value: "4" },
    { label: "5 (20px)", value: "5" },
    { label: "6 (24px)", value: "6" },
    { label: "8 (32px)", value: "8" },
    { label: "10 (40px)", value: "10" },
    { label: "12 (48px)", value: "12" },
    { label: "16 (64px)", value: "16" },
    { label: "20 (80px)", value: "20" },
    { label: "24 (96px)", value: "24" },
];

const SPACING_SIDES = [
    { title: "All", prefix: "" },
    { title: "Top", prefix: "t" },
    { title: "Bottom", prefix: "b" },
    { title: "Left", prefix: "l" },
    { title: "Right", prefix: "r" },
    { title: "X (horizontal)", prefix: "x" },
    { title: "Y (vertical)", prefix: "y" },
];

const BORDER_GROUPS = [
    {
        title: "Border", items: [
            { label: "Border", value: "border" },
            { label: "No Border", value: "border-0" },
            { label: "1px", value: "border" },
            { label: "2px", value: "border-2" },
            { label: "4px", value: "border-4" },
        ]
    },
    {
        title: "Border Side", items: [
            { label: "Top", value: "border-t" },
            { label: "Bottom", value: "border-b" },
            { label: "Left", value: "border-l" },
            { label: "Right", value: "border-r" },
        ]
    },
    {
        title: "Border Color", items: [
            { label: "Gray", value: "border-gray-300" },
            { label: "Blue", value: "border-blue-500" },
            { label: "Red", value: "border-red-500" },
            { label: "Green", value: "border-green-500" },
            { label: "Yellow", value: "border-yellow-500" },
            { label: "Black", value: "border-black" },
            { label: "White", value: "border-white" },
        ]
    },
];

const RADIUS_GROUPS = [
    {
        title: "Border Radius", items: [
            { label: "None", value: "rounded-none" },
            { label: "Small", value: "rounded-sm" },
            { label: "Default", value: "rounded" },
            { label: "Medium", value: "rounded-md" },
            { label: "Large", value: "rounded-lg" },
            { label: "XL", value: "rounded-xl" },
            { label: "2XL", value: "rounded-2xl" },
            { label: "Full", value: "rounded-full" },
        ]
    },
    {
        title: "Radius Position", items: [
            { label: "Top", value: "rounded-t-lg" },
            { label: "Bottom", value: "rounded-b-lg" },
            { label: "Left", value: "rounded-l-lg" },
            { label: "Right", value: "rounded-r-lg" },
        ]
    },
];

const SHADOW_ITEMS = [
    { label: "None", value: "shadow-none" },
    { label: "Small", value: "shadow-sm" },
    { label: "Default", value: "shadow" },
    { label: "Medium", value: "shadow-md" },
    { label: "Large", value: "shadow-lg" },
    { label: "XL", value: "shadow-xl" },
    { label: "2XL", value: "shadow-2xl" },
];

function hasClass(classes, val) {
    return (" " + (classes || "") + " ").includes(" " + val + " ");
}

function toggleClass(classes, val) {
    const list = (classes || "").split(/\s+/).filter(Boolean);
    if (list.includes(val)) {
        return list.filter((c) => c !== val).join(" ");
    }
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

export default function ColumnStyleModal({ open, style = {}, onSave, onCancel }) {
    const [tab, setTab] = useState("custom");
    const [localStyle, setLocalStyle] = useState(style);

    function set(key, val) {
        setLocalStyle((prev) => ({ ...prev, [key]: val }));
    }

    function toggleCls(val) {
        set("classes", toggleClass(localStyle.classes, val));
    }

    const cls = localStyle.classes || "";

    return (
        <Modal
            open={open}
            title="Column Settings"
            width={680}
            onCancel={onCancel}
            onOk={() => onSave(localStyle)}
            okText="Apply"
        >
            {/* Tabs */}
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

            {/* Custom */}
            {tab === "custom" && (
                <div>
                    <div className="ge-style-group-title">Element ID</div>
                    <Input
                        value={localStyle.id || ""}
                        onChange={(e) => set("id", e.target.value)}
                        placeholder="Enter unique ID"
                        style={{ marginBottom: 12 }}
                    />
                    <div className="ge-style-group-title">Custom CSS Classes</div>
                    <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>
                        Enter Tailwind/custom CSS classes (separated by spaces):
                    </div>
                    <Input
                        value={localStyle.classes || ""}
                        onChange={(e) => set("classes", e.target.value)}
                        placeholder="e.g. bg-white text-center my-4"
                    />
                    <div className="ge-style-group-title" style={{ marginTop: 16 }}>Background Color</div>
                    <Input
                        value={localStyle.bgColor || ""}
                        onChange={(e) => set("bgColor", e.target.value)}
                        placeholder="e.g. #ffffff or bg-blue-50"
                    />
                </div>
            )}

            {/* Layout */}
            {tab === "layout" && (
                <div>
                    {LAYOUT_GROUPS.map((group) => (
                        <div key={group.title}>
                            <div className="ge-style-group-title">{group.title}</div>
                            <ClassButtons items={group.items} classes={cls} onToggle={toggleCls} />
                        </div>
                    ))}
                </div>
            )}

            {/* Margin */}
            {tab === "margin" && (
                <div>
                    {SPACING_SIDES.map((side) => (
                        <div key={side.prefix}>
                            <div className="ge-style-group-title">
                                Margin {side.title}
                            </div>
                            <ClassButtons
                                items={SIZES.map((s) => ({
                                    label: s.label,
                                    value: `m${side.prefix}-${s.value}`,
                                }))}
                                classes={cls}
                                onToggle={toggleCls}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Padding */}
            {tab === "padding" && (
                <div>
                    {SPACING_SIDES.map((side) => (
                        <div key={side.prefix}>
                            <div className="ge-style-group-title">
                                Padding {side.title}
                            </div>
                            <ClassButtons
                                items={SIZES.map((s) => ({
                                    label: s.label,
                                    value: `p${side.prefix}-${s.value}`,
                                }))}
                                classes={cls}
                                onToggle={toggleCls}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Border */}
            {tab === "border" && (
                <div>
                    {BORDER_GROUPS.map((group) => (
                        <div key={group.title}>
                            <div className="ge-style-group-title">{group.title}</div>
                            <ClassButtons items={group.items} classes={cls} onToggle={toggleCls} />
                        </div>
                    ))}
                </div>
            )}

            {/* Border Radius */}
            {tab === "radius" && (
                <div>
                    {RADIUS_GROUPS.map((group) => (
                        <div key={group.title}>
                            <div className="ge-style-group-title">{group.title}</div>
                            <ClassButtons items={group.items} classes={cls} onToggle={toggleCls} />
                        </div>
                    ))}
                </div>
            )}

            {/* Shadow */}
            {tab === "shadow" && (
                <div>
                    <div className="ge-style-group-title">Box Shadow</div>
                    <ClassButtons items={SHADOW_ITEMS} classes={cls} onToggle={toggleCls} />
                </div>
            )}
        </Modal>
    );
}
