import { Button, Space, Tooltip, Tag } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";
import GridColumn from "./GridColumn";

export default function GridRow({
    row,
    rowIndex,
    totalRows,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    canDelete,
    toolbarContainerId,
    onEditorFocus,
    onEditorBlur,
}) {
    function updateColumn(colIndex, changes) {
        const newColumns = row.columns.map((col, i) =>
            i === colIndex ? { ...col, ...changes } : col
        );
        onUpdate({ ...row, columns: newColumns });
    }

    function addColumn() {
        const newColumns = [
            ...row.columns,
            { span: 6, content: "", style: {} },
        ];
        onUpdate({ ...row, columns: newColumns });
    }

    function deleteColumn(colIndex) {
        const newColumns = row.columns.filter((_, i) => i !== colIndex);
        onUpdate({ ...row, columns: newColumns });
    }

    const totalSpan = row.columns.reduce((s, c) => s + c.span, 0);

    return (
        <div
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
                </Space>
                <Space size={4}>
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
                        onChangeSpan={(span) => updateColumn(colIndex, { span })}
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
        </div>
    );
}
