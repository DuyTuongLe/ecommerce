import { useState } from "react";
import { Modal, Input } from "antd";

/* ───────── helpers ───────── */
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

/* ───────── spacing size helpers ───────── */
const SIZES_6 = [
    { label: "0", suffix: "0" },
    { label: "nhỏ", suffix: "1" },
    { label: "vừa", suffix: "2" },
    { label: "trung bình", suffix: "3" },
    { label: "lớn", suffix: "4" },
    { label: "rất lớn", suffix: "5" },
];

function spacingItems(prefix) {
    return SIZES_6.map((s) => ({ label: s.label, value: `${prefix}-${s.suffix}` }));
}

/* ───────── tab config ───────── */
const TAB_CONFIG = [
    /* 1 */ { key: "custom", label: "Custom" },
    /* 2 */ {
        key: "col-layout", label: "Bố cục", target: "colClasses", groups: [
            { title: "Flex Layout", items: [
                { label: "Sử dụng bố cục", value: "flex" },
                { label: "Hàng ngang", value: "flex-row" },
                { label: "Cột dọc", value: "flex-col" },
            ]},
            { title: "Justify (ngang)", items: [
                { label: "Căn trái", value: "justify-start" },
                { label: "Căn giữa", value: "justify-center" },
                { label: "Căn phải", value: "justify-end" },
            ]},
            { title: "Align (dọc)", items: [
                { label: "Căn trên", value: "items-start" },
                { label: "Căn giữa", value: "items-center" },
                { label: "Căn dưới", value: "items-end" },
            ]},
            { title: "Self Align", items: [
                { label: "Tự căn trái", value: "self-start" },
                { label: "Tự căn giữa", value: "self-center" },
                { label: "Tự căn phải", value: "self-end" },
            ]},
        ],
    },
    /* 3 */ {
        key: "display", label: "Hiển thị", groups: [
            { title: "Tổng quát", items: [
                { label: "Ẩn", value: "hidden" },
            ]},
            { title: "Display", items: [
                { label: "Khối", value: "block" },
                { label: "Nội tuyến", value: "inline" },
                { label: "Khối nội tuyến", value: "inline-block" },
                { label: "Flex", value: "flex" },
                { label: "Inline Flex", value: "inline-flex" },
                { label: "Grid", value: "grid" },
                { label: "Table", value: "table" },
                { label: "Table Cell", value: "table-cell" },
                { label: "Table Row", value: "table-row" },
            ]},
        ],
    },
    /* 4 */ {
        key: "flex-dir", label: "Flex - Hướng", groups: [
            { title: "Hướng", items: [
                { label: "Hàng ngang", value: "flex-row" },
                { label: "Hàng ngược", value: "flex-row-reverse" },
                { label: "Cột dọc", value: "flex-col" },
                { label: "Cột ngược", value: "flex-col-reverse" },
                { label: "Không ngắt dòng", value: "flex-nowrap" },
                { label: "Ngắt dòng ngược", value: "flex-wrap-reverse" },
            ]},
            { title: "Tổng quát", items: [
                { label: "Tự động ngắt dòng", value: "flex-wrap" },
            ]},
        ],
    },
    /* 5 */ {
        key: "flex-align", label: "Flex - Căn chỉnh", groups: [
            { title: "Justify Content", items: [
                { label: "Căn trái (ngang)", value: "justify-start" },
                { label: "Căn giữa (ngang)", value: "justify-center" },
                { label: "Căn phải (ngang)", value: "justify-end" },
                { label: "Căn đều (around)", value: "justify-around" },
                { label: "Căn đều (between)", value: "justify-between" },
                { label: "Căn đều (evenly)", value: "justify-evenly" },
            ]},
            { title: "Align Items", items: [
                { label: "Căn trên (dọc)", value: "items-start" },
                { label: "Căn giữa (dọc)", value: "items-center" },
                { label: "Căn dưới (dọc)", value: "items-end" },
                { label: "Căn baseline", value: "items-baseline" },
                { label: "Căn stretch", value: "items-stretch" },
            ]},
        ],
    },
    /* 6 */ {
        key: "flex-item", label: "Flex - Phần tử", groups: [
            { title: "Self Align", items: [
                { label: "Tự căn trên", value: "self-start" },
                { label: "Tự căn giữa", value: "self-center" },
                { label: "Tự căn dưới", value: "self-end" },
                { label: "Tự căn baseline", value: "self-baseline" },
                { label: "Tự căn stretch", value: "self-stretch" },
            ]},
            { title: "Flex", items: [
                { label: "Flex fill", value: "flex-1" },
                { label: "Flex grow", value: "grow" },
                { label: "Flex shrink", value: "shrink" },
            ]},
        ],
    },
    /* 7 */ {
        key: "margin", label: "Lề", spacingType: "margin",
    },
    /* 8 */ {
        key: "padding", label: "Đệm", spacingType: "padding",
    },
    /* 9 */ {
        key: "text-align", label: "Văn bản - Căn chỉnh", groups: [
            { title: "Căn chỉnh văn bản", items: [
                { label: "Căn trái", value: "text-left" },
                { label: "Căn giữa", value: "text-center" },
                { label: "Căn phải", value: "text-right" },
                { label: "Căn đều", value: "text-justify" },
            ]},
        ],
    },
    /* 10 */ {
        key: "text-style", label: "Văn bản - Kiểu chữ", groups: [
            { title: "Biến đổi chữ", items: [
                { label: "Chữ thường", value: "lowercase" },
                { label: "Chữ hoa", value: "uppercase" },
                { label: "Viết hoa đầu", value: "capitalize" },
            ]},
            { title: "Độ đậm", items: [
                { label: "Đậm", value: "font-bold" },
                { label: "Đậm hơn", value: "font-extrabold" },
                { label: "Bình thường", value: "font-normal" },
                { label: "Nhẹ", value: "font-light" },
                { label: "Nhẹ hơn", value: "font-thin" },
            ]},
            { title: "Kiểu chữ", items: [
                { label: "In nghiêng", value: "italic" },
                { label: "Không nghiêng", value: "not-italic" },
            ]},
            { title: "Trang trí", items: [
                { label: "Gạch ngang", value: "line-through" },
                { label: "Gạch dưới", value: "underline" },
                { label: "Không trang trí", value: "no-underline" },
            ]},
        ],
    },
    /* 11 */ {
        key: "text-size", label: "Văn bản - Kích thước", groups: [
            { title: "Kích thước chữ", items: [
                { label: "Rất nhỏ", value: "text-xs" },
                { label: "Nhỏ", value: "text-sm" },
                { label: "Trung bình", value: "text-base" },
                { label: "Lớn", value: "text-lg" },
                { label: "Rất lớn", value: "text-xl" },
                { label: "Cực lớn", value: "text-2xl" },
            ]},
        ],
    },
    /* 12 */ {
        key: "text-wrap", label: "Văn bản - Ngắt dòng", groups: [
            { title: "Tổng quát", items: [
                { label: "Tự động ngắt", value: "break-words" },
                { label: "Không ngắt", value: "whitespace-nowrap" },
                { label: "Ngắt từ", value: "break-all" },
            ]},
        ],
    },
    /* 13 */ {
        key: "text-color", label: "Màu chữ - Cơ bản", groups: [
            { title: "Màu chữ", items: [
                { label: "White", value: "text-white" },
                { label: "Black", value: "text-black" },
                { label: "Slate", value: "text-slate-600" },
                { label: "Gray", value: "text-gray-600" },
                { label: "Zinc", value: "text-zinc-600" },
                { label: "Red", value: "text-red-600" },
                { label: "Orange", value: "text-orange-600" },
                { label: "Amber", value: "text-amber-600" },
                { label: "Yellow", value: "text-yellow-600" },
                { label: "Green", value: "text-green-600" },
                { label: "Emerald", value: "text-emerald-600" },
                { label: "Teal", value: "text-teal-600" },
                { label: "Cyan", value: "text-cyan-600" },
                { label: "Sky", value: "text-sky-600" },
                { label: "Blue", value: "text-blue-600" },
                { label: "Indigo", value: "text-indigo-600" },
                { label: "Violet", value: "text-violet-600" },
                { label: "Purple", value: "text-purple-600" },
                { label: "Pink", value: "text-pink-600" },
                { label: "Rose", value: "text-rose-600" },
            ]},
        ],
    },
    /* 14 */ {
        key: "bg-color", label: "Màu nền - Cơ bản", groups: [
            { title: "Màu nền", items: [
                { label: "White", value: "bg-white" },
                { label: "Black", value: "bg-black" },
                { label: "Slate", value: "bg-slate-100" },
                { label: "Gray", value: "bg-gray-100" },
                { label: "Zinc", value: "bg-zinc-100" },
                { label: "Red", value: "bg-red-100" },
                { label: "Orange", value: "bg-orange-100" },
                { label: "Amber", value: "bg-amber-100" },
                { label: "Yellow", value: "bg-yellow-100" },
                { label: "Green", value: "bg-green-100" },
                { label: "Emerald", value: "bg-emerald-100" },
                { label: "Teal", value: "bg-teal-100" },
                { label: "Cyan", value: "bg-cyan-100" },
                { label: "Sky", value: "bg-sky-100" },
                { label: "Blue", value: "bg-blue-100" },
                { label: "Indigo", value: "bg-indigo-100" },
                { label: "Violet", value: "bg-violet-100" },
                { label: "Purple", value: "bg-purple-100" },
                { label: "Pink", value: "bg-pink-100" },
                { label: "Rose", value: "bg-rose-100" },
            ]},
        ],
    },
    /* 15 */ {
        key: "width", label: "Kích thước - Chiều rộng", groups: [
            { title: "Chiều rộng", items: [
                { label: "25%", value: "w-1/4" },
                { label: "50%", value: "w-1/2" },
                { label: "75%", value: "w-3/4" },
                { label: "100%", value: "w-full" },
                { label: "Auto", value: "w-auto" },
                { label: "Screen", value: "w-screen" },
            ]},
            { title: "Max", items: [
                { label: "Max 100%", value: "max-w-full" },
            ]},
            { title: "Min", items: [
                { label: "Min 100%", value: "min-w-full" },
            ]},
        ],
    },
    /* 16 */ {
        key: "height", label: "Kích thước - Chiều cao", groups: [
            { title: "Chiều cao", items: [
                { label: "25%", value: "h-1/4" },
                { label: "50%", value: "h-1/2" },
                { label: "75%", value: "h-3/4" },
                { label: "100%", value: "h-full" },
                { label: "Auto", value: "h-auto" },
                { label: "Screen", value: "h-screen" },
            ]},
            { title: "Max", items: [
                { label: "Max 100%", value: "max-h-full" },
            ]},
            { title: "Min", items: [
                { label: "Min 100%", value: "min-h-full" },
            ]},
        ],
    },
    /* 17 */ {
        key: "position", label: "Vị trí", groups: [
            { title: "Position", items: [
                { label: "Static", value: "static" },
                { label: "Relative", value: "relative" },
                { label: "Absolute", value: "absolute" },
                { label: "Fixed", value: "fixed" },
                { label: "Sticky", value: "sticky" },
            ]},
            { title: "Top", items: [
                { label: "0", value: "top-0" },
                { label: "50%", value: "top-1/2" },
                { label: "100%", value: "top-full" },
            ]},
            { title: "Bottom", items: [
                { label: "0", value: "bottom-0" },
                { label: "50%", value: "bottom-1/2" },
                { label: "100%", value: "bottom-full" },
            ]},
            { title: "Left", items: [
                { label: "0", value: "left-0" },
                { label: "50%", value: "left-1/2" },
                { label: "100%", value: "left-full" },
            ]},
            { title: "Right", items: [
                { label: "0", value: "right-0" },
                { label: "50%", value: "right-1/2" },
                { label: "100%", value: "right-full" },
            ]},
            { title: "Căn giữa", items: [
                { label: "X-Y", value: "inset-0" },
                { label: "X", value: "inset-x-0" },
                { label: "Y", value: "inset-y-0" },
            ]},
        ],
    },
    /* 18 */ {
        key: "overflow", label: "Overflow", groups: [
            { title: "Tổng quát", items: [
                { label: "Ẩn", value: "overflow-hidden" },
                { label: "Tự động", value: "overflow-auto" },
                { label: "Cuộn", value: "overflow-scroll" },
                { label: "Hiển thị", value: "overflow-visible" },
            ]},
            { title: "Ngang (X)", items: [
                { label: "Ẩn X", value: "overflow-x-hidden" },
                { label: "Tự động X", value: "overflow-x-auto" },
                { label: "Cuộn X", value: "overflow-x-scroll" },
            ]},
            { title: "Dọc (Y)", items: [
                { label: "Ẩn Y", value: "overflow-y-hidden" },
                { label: "Tự động Y", value: "overflow-y-auto" },
                { label: "Cuộn Y", value: "overflow-y-scroll" },
            ]},
        ],
    },
    /* 19 */ {
        key: "visibility", label: "Hiển thị khác", groups: [
            { title: "Tổng quát", items: [
                { label: "Hiện", value: "visible" },
                { label: "Ẩn", value: "invisible" },
            ]},
            { title: "Opacity", items: [
                { label: "0", value: "opacity-0" },
                { label: "25%", value: "opacity-25" },
                { label: "50%", value: "opacity-50" },
                { label: "75%", value: "opacity-75" },
                { label: "100%", value: "opacity-100" },
            ]},
        ],
    },
    /* 20 */ {
        key: "border", label: "Viền", groups: [
            { title: "Cơ bản", items: [
                { label: "Không viền", value: "border-0" },
                { label: "1px", value: "border" },
                { label: "2px", value: "border-2" },
                { label: "4px", value: "border-4" },
            ]},
            { title: "Vị trí", items: [
                { label: "Trên", value: "border-t" },
                { label: "Dưới", value: "border-b" },
                { label: "Trái", value: "border-l" },
                { label: "Phải", value: "border-r" },
            ]},
            { title: "Màu", items: [
                { label: "Gray", value: "border-gray-300" },
                { label: "Red", value: "border-red-500" },
                { label: "Blue", value: "border-blue-500" },
                { label: "Green", value: "border-green-500" },
                { label: "Yellow", value: "border-yellow-500" },
                { label: "Black", value: "border-black" },
                { label: "White", value: "border-white" },
            ]},
        ],
    },
    /* 21 */ {
        key: "radius", label: "Bo góc", groups: [
            { title: "Cơ bản", items: [
                { label: "Bo góc", value: "rounded" },
                { label: "Tròn", value: "rounded-full" },
                { label: "Không bo", value: "rounded-none" },
            ]},
            { title: "Kích thước", items: [
                { label: "Nhỏ", value: "rounded-sm" },
                { label: "Vừa", value: "rounded-md" },
                { label: "Lớn", value: "rounded-lg" },
                { label: "Rất lớn", value: "rounded-xl" },
                { label: "Cực lớn", value: "rounded-2xl" },
            ]},
            { title: "Vị trí", items: [
                { label: "Trên", value: "rounded-t-lg" },
                { label: "Dưới", value: "rounded-b-lg" },
                { label: "Trái", value: "rounded-l-lg" },
                { label: "Phải", value: "rounded-r-lg" },
            ]},
        ],
    },
    /* 22 */ {
        key: "shadow", label: "Đổ bóng", groups: [
            { title: "Đổ bóng", items: [
                { label: "Không", value: "shadow-none" },
                { label: "Nhỏ", value: "shadow-sm" },
                { label: "Vừa", value: "shadow" },
                { label: "Lớn", value: "shadow-md" },
                { label: "Rất lớn", value: "shadow-lg" },
                { label: "Cực lớn", value: "shadow-xl" },
            ]},
        ],
    },
];

/* ───────── margin / padding group builders ───────── */
const MARGIN_GROUPS = [
    { title: "Lề (tất cả)", items: spacingItems("m") },
    { title: "Lề trên", items: spacingItems("mt") },
    { title: "Lề dưới", items: spacingItems("mb") },
    { title: "Lề trái", items: spacingItems("ms") },
    { title: "Lề phải", items: spacingItems("me") },
    { title: "Lề ngang", items: spacingItems("mx") },
    { title: "Lề dọc", items: spacingItems("my") },
    { title: "Khác", items: [
        { label: "Căn giữa ngang", value: "mx-auto" },
        { label: "Margin auto", value: "m-auto" },
        { label: "Margin auto phải", value: "ms-auto" },
    ]},
];

const PADDING_GROUPS = [
    { title: "Đệm (tất cả)", items: spacingItems("p") },
    { title: "Đệm trên", items: spacingItems("pt") },
    { title: "Đệm dưới", items: spacingItems("pb") },
    { title: "Đệm trái", items: spacingItems("ps") },
    { title: "Đệm phải", items: spacingItems("pe") },
    { title: "Đệm ngang", items: spacingItems("px") },
    { title: "Đệm dọc", items: spacingItems("py") },
];

/* ───────── component ───────── */
export default function ColumnStyleModal({ open, style = {}, onSave, onCancel }) {
    const [tab, setTab] = useState("custom");
    const [localStyle, setLocalStyle] = useState(style);

    function set(key, val) {
        setLocalStyle((prev) => ({ ...prev, [key]: val }));
    }

    /* toggle for content classes (localStyle.classes) */
    function toggleCls(val) {
        set("classes", toggleClass(localStyle.classes, val));
    }

    /* toggle for column wrapper classes (localStyle.colClasses) */
    function toggleColCls(val) {
        set("colClasses", toggleClass(localStyle.colClasses, val));
    }

    const cls = localStyle.classes || "";
    const colCls = localStyle.colClasses || "";

    /* resolve which groups to render for the active tab */
    const activeTab = TAB_CONFIG.find((t) => t.key === tab);

    function renderGroups(groups, classes, onToggle) {
        return groups.map((group) => (
            <div key={group.title}>
                <div className="ge-style-group-title">{group.title}</div>
                <ClassButtons items={group.items} classes={classes} onToggle={onToggle} />
            </div>
        ));
    }

    function renderTabContent() {
        if (!activeTab) return null;

        /* Custom tab — special layout */
        if (activeTab.key === "custom") {
            return (
                <div>
                    <div className="ge-style-group-title">Element ID</div>
                    <Input
                        value={localStyle.id || ""}
                        onChange={(e) => set("id", e.target.value)}
                        placeholder="Nhập ID duy nhất"
                        style={{ marginBottom: 12 }}
                    />
                    <div className="ge-style-group-title">Custom CSS Classes</div>
                    <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>
                        Nhập các class Tailwind/CSS tùy chỉnh (cách nhau bằng dấu cách):
                    </div>
                    <Input
                        value={localStyle.classes || ""}
                        onChange={(e) => set("classes", e.target.value)}
                        placeholder="vd: bg-white text-center my-4"
                    />
                    <div className="ge-style-group-title" style={{ marginTop: 16 }}>Background Color</div>
                    <Input
                        value={localStyle.bgColor || ""}
                        onChange={(e) => set("bgColor", e.target.value)}
                        placeholder="vd: #ffffff hoặc bg-blue-50"
                    />
                </div>
            );
        }

        /* Spacing tabs — margin / padding */
        if (activeTab.spacingType === "margin") {
            return <div>{renderGroups(MARGIN_GROUPS, cls, toggleCls)}</div>;
        }
        if (activeTab.spacingType === "padding") {
            return <div>{renderGroups(PADDING_GROUPS, cls, toggleCls)}</div>;
        }

        /* Column-level tab (Bố cục) */
        if (activeTab.target === "colClasses") {
            return <div>{renderGroups(activeTab.groups, colCls, toggleColCls)}</div>;
        }

        /* All other tabs — content classes */
        if (activeTab.groups) {
            return <div>{renderGroups(activeTab.groups, cls, toggleCls)}</div>;
        }

        return null;
    }

    return (
        <Modal
            open={open}
            title="Column Settings"
            width={720}
            onCancel={onCancel}
            onOk={() => onSave(localStyle)}
            okText="Áp dụng"
        >
            {/* Tabs — scrollable horizontally */}
            <div className="ge-style-tabs">
                {TAB_CONFIG.map((t) => (
                    <div
                        key={t.key}
                        className={`ge-style-tab ${tab === t.key ? "active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </div>
                ))}
            </div>

            {/* Tab content */}
            {renderTabContent()}
        </Modal>
    );
}
