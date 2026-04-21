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

        <button onClick={onReload}>
          <i className="fa-solid fa-rotate"></i>
        </button>

        <button onClick={onCreate}>
          <i className="fa-solid fa-plus"></i>
          Add
        </button>

        <button onClick={onEdit}>
          <i className="fa-solid fa-pen"></i>
          Edit
        </button>

        <button onClick={onDelete}>
          <i className="fa-solid fa-trash"></i>
          Remove
        </button>

        <button onClick={onPublish}>
          <i className="fa-solid fa-circle-check"></i>
          Publish
        </button>

        <button onClick={onUnpublish}>
          <i className="fa-solid fa-xmark"></i>
          Unpublish
        </button>
      </div>

    </div>
  );
}