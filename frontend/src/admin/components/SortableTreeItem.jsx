// src/admin/components/SortableTreeItem.jsx

import {

  useSortable

} from "@dnd-kit/sortable";

import {

  CSS

} from "@dnd-kit/utilities";

import {

  Button,
  Tag,
  Space

} from "antd";

export default function
SortableTreeItem({

  item,

  onIndent,
  onOutdent

}) {

  const {

    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging

  } = useSortable({

    id: item.id

  });

  const style = {

  transform:
    CSS.Transform.toString(
      transform
    ),

  transition,

  marginLeft:
    item.depth * 40,

  background:
    isDragging
      ? "#f5f5f5"
      : "#fff",

  border: "1px solid #eee",

  borderRadius: 10,

  padding: 14,

  marginBottom: 10,

  display: "grid",

  gridTemplateColumns:
    "60px 1fr 120px 140px 120px",

  alignItems: "center",

  gap: 12,

  boxShadow:
    isDragging
      ? "0 4px 12px rgba(0,0,0,.1)"
      : "none"

};

  return (

  <div

    ref={setNodeRef}

    style={style}

  >

    {/* DRAG */}

    <div

      {...attributes}
      {...listeners}

      style={{
        cursor: "grab",
        fontSize: 18
      }}

    >

      ☰

    </div>

    <div>

      <div
        style={{
          fontWeight: 600
        }}
      >

        {

          item.ngonngus?.[0]
            ?.danduong_nn_ten

        }

      </div>

      <div
        style={{
          fontSize: 12,
          color: "#999"
        }}
      >

        ID: {item.id}

      </div>

    </div>

    <div>

      {

        item.macdinh

          ? (
            <Tag color="green">
              Default
            </Tag>
          )

          : (
            <Tag>
              No
            </Tag>
          )

      }

    </div>

    {/* STATUS */}

    <div>

      {

        item.trangthai

          ? (
            <Tag color="green">
              Publish
            </Tag>
          )

          : (
            <Tag color="red">
              UnPublish
            </Tag>
          )

      }

    </div>

    {/* ACTIONS */}

    <Space>

      <Button
        size="small"
        onClick={() =>
          onIndent(item.id)
        }
      >
        →
      </Button>

      <Button
        size="small"
        onClick={() =>
          onOutdent(item.id)
        }
      >
        ←
      </Button>

    </Space>

  </div>

);

}