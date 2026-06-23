import { useId, useState } from "react";
import { Button, Segmented } from "antd";
import "./grid-editor.css";
import {
    PlusOutlined,
    DesktopOutlined,
    LaptopOutlined,
    TabletOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableRow from "./SortableRow";

const VIEWPORT_OPTIONS = [
    { value: "desktop", icon: <DesktopOutlined />, label: "Desktop", width: "100%" },
    { value: "laptop", icon: <LaptopOutlined />, label: "1024px", width: 1024 },
    { value: "tablet", icon: <TabletOutlined />, label: "768px", width: 768 },
    { value: "mobile", icon: <MobileOutlined />, label: "576px", width: 576 },
];

export default function GridEditor({ value, onChange }) {
    const rows = value?.rows || [];
    const reactId = useId().replace(/:/g, "");
    const toolbarContainerId = `grid-toolbar-${reactId}`;
    const [viewport, setViewport] = useState("desktop");
    const [editorActive, setEditorActive] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const currentVp = VIEWPORT_OPTIONS.find((v) => v.value === viewport);
    const previewWidth = currentVp?.width || "100%";

    function updateRows(newRows) {
        onChange({ ...value, rows: newRows, version: 1 });
    }
    function addRow() {
        updateRows([...rows, {
            columns: [{
                span: { desktop: 12, laptop: 12, tablet: 12, mobile: 12 },
                content: "",
                style: {},
            }],
        }]);
    }
    function updateRow(index, newRow) {
        updateRows(rows.map((r, i) => (i === index ? newRow : r)));
    }
    function deleteRow(index) {
        updateRows(rows.filter((_, i) => i !== index));
    }
    function moveRow(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= rows.length) return;
        updateRows(arrayMove([...rows], index, newIndex));
    }
    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        updateRows(arrayMove([...rows], parseInt(active.id), parseInt(over.id)));
    }

    const rowIds = rows.map((_, i) => String(i));

    return (
        <div>
            {/* Toolbar: shown only when editor active */}
            <div
                id={toolbarContainerId}
                className={`ge-toolbar-container ${editorActive ? "ge-toolbar-visible" : ""}`}
            />

            {/* Responsive toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Segmented
                    size="small"
                    value={viewport}
                    onChange={setViewport}
                    options={VIEWPORT_OPTIONS.map((v) => ({
                        value: v.value, icon: v.icon, label: v.label,
                    }))}
                />
            </div>

            {/* Preview */}
            <div
                style={{
                    maxWidth: typeof previewWidth === "number" ? previewWidth : undefined,
                    margin: "0 auto",
                    transition: "max-width 0.3s ease",
                }}
            >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                        {rows.map((row, index) => (
                            <SortableRow
                                key={index}
                                id={String(index)}
                                row={row}
                                rowIndex={index}
                                totalRows={rows.length}
                                viewport={viewport}
                                onUpdate={(newRow) => updateRow(index, newRow)}
                                onDelete={() => deleteRow(index)}
                                onMoveUp={() => moveRow(index, -1)}
                                onMoveDown={() => moveRow(index, 1)}
                                canDelete={rows.length > 1}
                                toolbarContainerId={toolbarContainerId}
                                onEditorFocus={() => setEditorActive(true)}
                                onEditorBlur={() => { setTimeout(() => setEditorActive(false), 300); }}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <Button type="dashed" block icon={<PlusOutlined />} onClick={addRow} style={{ marginTop: 8 }}>
                    Add Row
                </Button>
            </div>
        </div>
    );
}
