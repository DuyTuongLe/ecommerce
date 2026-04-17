//admin/components/MenuToolbar.jsx

export default function MenuToolbar({
  lang,
  setLang,
  group,
  groups,
  setGroup,
  onReload,
  onCreate,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish
}) {
  return (
    <div className="toolbar">

      {/* LEFT */}
      <div className="toolbar-left">

        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="vi">VI</option>
          <option value="en">EN</option>
        </select>

        <select value={group} onChange={e => setGroup(e.target.value)}>
            {groups.map(g => (
                <option key={g.id} value={g.id}>
                {g.danduong_nhom_tieude}
                </option>
            ))}
        </select>

        <button onClick={onReload}>🔄</button>
        <button onClick={onCreate}>➕</button>
        <button onClick={onEdit}>✏️</button>
        <button onClick={onDelete}>🗑</button>
        <button onClick={onPublish}>👁</button>
        <button onClick={onUnpublish}>🚫</button>
      </div>

    </div>
  );
}