import { useState, useMemo, useEffect, useRef } from "react";
import useMenuAdmin from "../hooks/useMenuAdmin";
import { buildTree } from "../../shared/utils/buildTree";
import MenuToolbar from "../components/MenuToolbar";
import useMenuGroup from "../hooks/useMenuGroup";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableMenuItem from "../components/SortableMenuItem";
import { flattenMenu } from "../../shared/utils/flattenMenu";
import { api } from "../../shared/services/api";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { flattenTreeWithDepth } from "../../shared/utils/flattenTreeWithDepth";
import { buildTreeFromFlat } from "../../shared/utils/buildTreeFromFlat";
import MenuForm from "../components/MenuForm";

export default function MenuManager() {
  const saveTimeout = useRef(null);

  const [lang, setLang] = useState("vi");
  const groups = useMenuGroup();
  const [group, setGroup] = useState("");
  const [selected, setSelected] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const [treeState, setTreeState] = useState([]);
  const [flatItems, setFlatItems] = useState([]);

  const [overId, setOverId] = useState(null);

  const raw = useMenuAdmin(lang, group, reloadKey);
  const tree = useMemo(() => buildTree(raw), [raw]);
  const [previewParentId, setPreviewParentId] = useState(null);
  const [formWidth, setFormWidth] = useState(300);
  const isResizing = useRef(false);
  const containerRef = useRef(null);

  // init group
  useEffect(() => {
    if (!group && groups.length > 0) {
      setGroup(groups[0].id);
    }
  }, [groups, group]);

  // reset selected
  useEffect(() => {
    setSelected([]);
  }, [group]);

  useEffect(() => {
    setTreeState(tree);
  }, [tree]);

  useEffect(() => {
    setFlatItems(flattenTreeWithDepth(treeState));
  }, [treeState]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      const newWidth = rect.right - e.clientX;

      const finalWidth = Math.max(200, Math.min(600, newWidth));
      setFormWidth(finalWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // save debounce
  const handleSaveOrder = (newTree) => {
    setTreeState(newTree);

    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      const payload = flattenMenu(newTree);

      try {
        await api.reorderMenu(payload);
        console.log("Saved!");
      } catch (err) {
        console.error("Save failed", err);
      }
    }, 300);
  };

  // tránh vòng lặp cha con
  const isInvalidMove = (items, movedId, parentId) => {
    if (!parentId) return false;

    const findChildren = (id) =>
      items
        .filter(i => i.parentId === id)
        .flatMap(i => [i.id, ...findChildren(i.id)]);

    return findChildren(movedId).includes(parentId);
  };
  const isDropOnItem = (event) => {
    return event.over && event.active.id !== event.over.id;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  // 🔥 DRAG LOGIC MỚI: ĐÈ → LÀM CON
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = flatItems.findIndex(i => i.id === active.id);
    const newIndex = flatItems.findIndex(i => i.id === over.id);

    let newItems = arrayMove(flatItems, oldIndex, newIndex);

    const movedItem = { ...newItems[newIndex] };

    const isRoot = event.delta.x < -20;

    let parentId = null;

    if (!isRoot) {
      parentId = over.id;
    }

    if (parentId === movedItem.id) return;
    if (isInvalidMove(newItems, movedItem.id, parentId)) return;

    movedItem.parentId = parentId;

    const parentItem = newItems.find(i => i.id === parentId);
    movedItem.depth = parentItem ? parentItem.depth + 1 : 0;

    newItems[newIndex] = movedItem;

    setFlatItems(newItems);

    const newTree = buildTreeFromFlat(newItems);
    handleSaveOrder(newTree);

    setOverId(null);
  };

  return (
    <div className="menuManager" ref={containerRef}>
      <div className="menuContent">
        <MenuToolbar
          lang={lang}
          setLang={setLang}
          group={group}
          groups={groups}
          setGroup={setGroup}
          onReload={() => setReloadKey(prev => prev + 1)}
        />

        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 100px 100px 60px",
            fontWeight: "bold",
            padding: "6px 0px",
            borderBottom: "2px solid #ccc",
            background: "#fafafa"
          }}
        >
          <div class="text-center"><i class="fa-regular fa-square"></i></div>
          <div>Tiêu đề</div>
          <div style={{ textAlign: "center" }}>Default</div>
          <div style={{ textAlign: "center" }}>Publish</div>
          <div style={{ textAlign: "center" }}>ID</div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}

          onDragOver={(event) => {
            const { over, delta } = event;
            if (!over) return;

            if (delta.x < -20) {
              setPreviewParentId(null);
            } else {
              setPreviewParentId(over.id);
            }
          }}

          onDragEnd={(event) => {
            handleDragEnd(event);
            setPreviewParentId(null); // 👈 QUAN TRỌNG
          }}

          onDragCancel={() => {
            setPreviewParentId(null); // 👈 backup
          }}
        >
          <SortableContext
            items={flatItems.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul style={{ listStyle: "none", padding: 0 }}>
              {flatItems.map(flat => {
                const data = {
                  ...flat.data,
                  depth: flat.depth
                };

                return (
                  <SortableMenuItem
                    key={flat.id}
                    item={data}
                    selected={selected}
                    setSelected={setSelected}
                    isParent={previewParentId === flat.id}
                  />
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      <div
        className="resizer-vertical"
        onMouseDown={() => (isResizing.current = true)}
      />

      {/* RIGHT */}
      <div
        className="menu-form-panel"
        style={{ width: formWidth }}
      >
        <MenuForm />
      </div>
    </div>
  );
}