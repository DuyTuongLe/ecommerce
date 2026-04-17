//admin/pages/MenuManager.jsx
import { useState, useMemo, useEffect } from "react";
import useMenuAdmin from "../hooks/useMenuAdmin";
import { buildTree } from "../../shared/utils/buildTree";
import MenuToolbar from "../components/MenuToolbar";
import useMenuGroup from "../hooks/useMenuGroup";

// render tree đệ quy
function MenuTree({ items, level = 1, selected, setSelected }) {
  const handleSelect = (item) => {
    const exists = selected.find(i => i.id === item.id);

    if (exists) {
      setSelected(selected.filter(i => i.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <ul style={{ paddingLeft: level * 15 }}>
      {items.map(item => {
        const isActive = selected.some(i => i.id === item.id);

        return (
          <li key={item.id}>
            <div
              onClick={() => handleSelect(item)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                background: isActive ? "#d0ebff" : "transparent",
                padding: "4px 6px",
                borderRadius: "4px"
              }}
            >
              <span>{item.ten}</span>
            </div>

            {item.children?.length > 0 && (
              <MenuTree
                items={item.children}
                level={level + 1}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function MenuManager() {
  const [lang, setLang] = useState("vi");
  const groups = useMenuGroup();
  const [group, setGroup] = useState("");
  const [selected, setSelected] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  // set group mặc định
  useEffect(() => {
    if (!group && groups.length > 0) {
      setGroup(groups[0].id);
    }
  }, [groups, group]);

  // reset selected khi đổi group
  useEffect(() => {
    setSelected([]);
  }, [group]);

  const raw = useMenuAdmin(lang, group, reloadKey);
  const tree = useMemo(() => buildTree(raw), [raw]);

  // handlers
  const handleReload = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleCreate = () => {
    console.log("Create");
  };

  const handleEdit = () => {
    if (selected.length !== 1) {
      alert("Chọn 1 menu để sửa");
      return;
    }
    console.log("Edit", selected[0]);
  };

  const handleDelete = () => {
    if (selected.length === 0) return;
    console.log("Delete", selected.map(i => i.id));
  };

  const handlePublish = () => {
    console.log("Publish", selected);
  };

  const handleUnpublish = () => {
    console.log("Unpublish", selected);
  };

  return (
    <div>
      <h2>Quản lý Menu</h2>

      <MenuToolbar
        lang={lang}
        setLang={setLang}
        group={group}
        groups={groups}
        setGroup={setGroup}
        onReload={handleReload}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      <MenuTree
        items={tree}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}