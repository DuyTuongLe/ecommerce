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

import {

  CaretRightOutlined, MenuOutlined

} from "@ant-design/icons";

export default function
  SortableTreeItem({

    item,
    expandedIds,
    onToggleExpand,
    onIndent,
    onOutdent,
    onSelect,
    active,
    language

  }) {

  const {

    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging

  } = useSortable({

    id: item.id,
    transition: {
      duration: 150
    }

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
    cursor: "pointer",

    boxShadow:
      isDragging
        ? "0 4px 12px rgba(0,0,0,.1)"
        : active
          ? "0 0 0 2px rgba(22,119,255,.15)"
          : "none"

  };

  const hasChildren =
    item.children?.length;

  const expanded =
    expandedIds?.includes(
      item.id
    );

  const translation =

    item.ngonngus?.find(

      x => x.ngonngu === language

    );

  return (

    <div

      ref={setNodeRef}
      style={style}
      onClick={() =>
        onSelect?.(item)
      }

    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >

        {/* DRAG HANDLE */}

        <div

          {...attributes}
          {...listeners}

          onClick={(e) => {
            e.stopPropagation();
          }}

          style={{

            cursor: "grab",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            userSelect: "none",

            fontSize: 16,

            color: "#999"

          }}

        >

          <MenuOutlined />

        </div>

        {/* TOGGLE */}

        <div

          onPointerDown={(e) => {

            e.stopPropagation();

          }}

          onClick={(e) => {

            e.stopPropagation();

            if (!hasChildren) {
              return;
            }

            onToggleExpand(
              item.id
            );

          }}

          style={{

            cursor:
              hasChildren
                ? "pointer" : "default",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            userSelect: "none",

            transition:
              "transform .2s ease",

            transform:

              expanded

                ? "rotate(90deg)"

                : "rotate(0deg)",

            opacity:
              hasChildren
                ? 1
                : .35

          }}

        >

          <CaretRightOutlined style={{ fontSize: "18px" }} />

        </div>

      </div>
      <div

        style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <div
          style={{

            fontWeight: 600,

            cursor:
              hasChildren
                ? "pointer"
                : "default"

          }}

        >

          {

            translation
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

            : null

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

      <Space

        onPointerDown={(e) => {

          e.stopPropagation();

        }}

      >

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