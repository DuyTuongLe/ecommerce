import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import GridRow from "./GridRow";

export default function SortableRow({ id, ...props }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div
                {...attributes}
                {...listeners}
                style={{
                    position: "absolute",
                    top: 12,
                    left: -24,
                    cursor: "grab",
                    color: "#999",
                    fontSize: 16,
                    zIndex: 10,
                }}
            >
                <HolderOutlined />
            </div>
            <GridRow {...props} />
        </div>
    );
}
