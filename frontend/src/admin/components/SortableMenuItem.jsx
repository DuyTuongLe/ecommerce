// admin/components/SortableMenuItem.jsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableMenuItem({
  item,
  selected,
  setSelected,
  isParent = false,
  style = {},
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const isActive = selected.some(i => i.id === item.id);

  const handleSelect = () => {
    const exists = selected.find(i => i.id === item.id);
    if (exists) {
      setSelected(selected.filter(i => i.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const finalStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...style
  };

  // 🔥 background logic
  const getBackground = () => {
    if (isDragging) return "#d0ebff";
    if (isParent) return "#ffe066";
    if (isActive) return "#f1faff";
    return "#fff";
  };

  return (
    <li ref={setNodeRef} style={finalStyle}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 100px 100px 60px",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          background: getBackground(), 
        }}
      >

        {/* CHECKBOX */}
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />

        {/* TITLE */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
          style={{
            cursor: "grab",
            padding: "6px 4px",
            paddingLeft: (item.depth || 0) * 20,
            userSelect: "none"
          }}
        >
          {item.ten}
        </div>

        {/* DEFAULT */}
        <div onClick={handleSelect} style={{ textAlign: "center", cursor: "pointer" }}>
          {item.macdinh == 1 ? "✔" : ""}
        </div>

        {/* PUBLISH */}
        <div onClick={handleSelect} style={{ textAlign: "center", cursor: "pointer" }}>
          {item.trangthai == 1 ? <i className='fa-solid fa-circle-check text-lime-600 text-lg'></i> : <i className='fa-solid fa-xmark text-red-600 text-lg'></i>}
        </div>
        
        {/* ID */}
        <div style={{ textAlign: "center", color: "#888" }}>
          {item.id}
        </div>

      </div>
    </li>
  );
}