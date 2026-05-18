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
    onOutdent,
    onSelect,
    active

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
      active
        ? "#e6f4ff" :
      isDragging
        ? "#f5f5f5"
        : "#fff",

    border:
      active
        ? "1px solid #1677ff"
        : "1px solid #eee",

    borderRadius: 10,

    padding: 14,

    marginBottom: 10,

    display: "grid",

    gridTemplateColumns:
      "40px 1fr 80px 90px 100px 40px",

    alignItems: "center",

    gap: 12,

    boxShadow:
      isDragging
        ? "0 4px 12px rgba(0,0,0,.1)"
        : active
        ? "0 0 0 2px rgba(22,119,255,.15)"
        : "none"

  };

  return (

    <div

      ref={setNodeRef}

      style={style}

      onClick={() =>
        onSelect?.(item)
      }
      
      


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



      <div
        style={{
          fontSize: 12,
          color: "#999"
        }}
      >



        ID: {item.id ? item.id : 0}

      </div>

    </div>

  );

}