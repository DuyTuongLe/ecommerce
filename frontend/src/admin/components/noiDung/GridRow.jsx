import { useState } from "react";
import { Button, Space, Tooltip, Tag } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import GridColumn from "./GridColumn";
import RowStyleModal from "./RowStyleModal";

function normalizeSpan(span) {
    if (typeof span === "number") {
        return { desktop: span, laptop: span, tablet: span, mobile: 12 };
    }
    return {
        desktop: span?.desktop ?? 6,
        laptop: span?.laptop ?? span?.desktop ?? 6,
        tablet: span?.tablet ?? 6,
        mobile: span?.mobile ?? 12,
    };
}

function getSpanForViewport(span, viewport) {
    if (typeof span === "number") return span;
    if (typeof span === "object" && span !== null) return span[viewport] ?? span.desktop ?? 6;
    return 6;
}

export default function GridRow({
    row,
    rowIndex,
    totalRows,
    viewport = "desktop",
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    canDelete,
    toolbarContainerId,
    onEditorFocus,
    onEditorBlur,
}) {
    const [rowStyleOpen, setRowStyleOpen] = useState(false);
    const rowStyle = row.style || {};
    const rowClasses = rowStyle.classes || "";

    function updateColumn(colIndex, changes) {
        const newColumns = row.columns.map((col, i) =>
            i === colIndex ? { ...col, ...changes } : col
        );
        onUpdate({ ...row, columns: newColumns });
    }

    function handleChangeSpan(colIndex, newSpanValue, vp) {
        const col = row.columns[colIndex];
        const spanObj = normalizeSpan(col.span);
        spanObj[vp] = newSpanValue;
        updateColumn(colIndex, { span: spanObj });
    }

    function addColumn() {
        const newColumns = [
            ...row.columns,
            { span: { desktop: 6, laptop: 6, tablet: 6, mobile: 12 }, content: "", style: {} },
        ];
        onUpdate({ ...row, columns: newColumns });
    }

    function deleteColumn(colIndex) {
        const newColumns = row.columns.filter((_, i) => i !== colIndex);
        onUpdate({ ...row, columns: newColumns });
    }

    const totalSpan = row.columns.reduce(
        (s, c) => s + getSpanForViewport(c.span, viewport), 0
    );

    return (
        <div
            id={rowStyle.id || undefined}
            className={rowClasses}
            style={{
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                marginBottom: 16,
                background: "#fafafa",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "#f0f0f0",
                    borderRadius: "10px 10px 0 0",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Space size="small">
                    <Tag color="blue" style={{ margin: 0 }}>Row {rowIndex + 1}</Tag>
                    <span style={{ fontSize: 11, color: "#999" }}>
                        {row.columns.length} col{row.columns.length > 1 ? "s" : ""} &middot; {totalSpan}/12
                    </span>
                    {rowClasses && (
                        <span style={{ fontSize: 10, color: "#1677ff", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {rowClasses}
                        </span>
                    )}
                </Space>
                <Space size={4}>
                    <Tooltip title="Row settings">
                        <Button size="small" type="text" icon={<SettingOutlined />} onClick={() => setRowStyleOpen(true)} />
                    </Tooltip>
                    <Tooltip title="Move up">
                        <Button size="small" type="text" icon={<ArrowUpOutlined />} onClick={onMoveUp} disabled={rowIndex === 0} />
                    </Tooltip>
                    <Tooltip title="Move down">
                        <Button size="small" type="text" icon={<ArrowDownOutlined />} onClick={onMoveDown} disabled={rowIndex === totalRows - 1} />
                    </Tooltip>
                    <Tooltip title="Add column">
                        <Button size="small" type="text" icon={<PlusOutlined />} onClick={addColumn} />
                    </Tooltip>
                    {canDelete && (
                        <Tooltip title="Delete row">
                            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
                        </Tooltip>
                    )}
                </Space>
            </div>

            <div className="grid grid-cols-12 gap-3" style={{ padding: 10 }}>
                {row.columns.map((col, colIndex) => (
                    <GridColumn
                        key={colIndex}
                        column={col}
                        viewport={viewport}
                        onChangeSpan={(val, vp) => handleChangeSpan(colIndex, val, vp)}
                        onChangeContent={(content) => updateColumn(colIndex, { content })}
                        onChangeStyle={(style) => updateColumn(colIndex, { style })}
                        onDelete={() => deleteColumn(colIndex)}
                        canDelete={row.columns.length > 1}
                        toolbarContainerId={toolbarContainerId}
                        onEditorFocus={onEditorFocus}
                        onEditorBlur={onEditorBlur}
                    />
                ))}
            </div>

            <RowStyleModal
                open={rowStyleOpen}
                style={rowStyle}
                onSave={(newStyle) => {
                    onUpdate({ ...row, style: newStyle });
                    setRowStyleOpen(false);
                }}
                onCancel={() => setRowStyleOpen(false)}
            />
        </div>
    );
}
