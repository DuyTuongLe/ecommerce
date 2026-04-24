//admin/components/MenuForm.jsx
import { useState, useEffect } from "react";
import { api } from "../../shared/services/api";

export default function MenuForm({
  lang,
  parents,
  groups
}) {

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "page",
    parentId: null,
    groupId: ""
  });

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      parentId: null
    }));
  }, [form.groupId]);

  const filteredParents = (parents || []).filter(p => {
  const groupId = p.data?.danduong_nhom_id || p.danduong_nhom_id;
  return groupId == form.groupId;
});

  return (
    <div className="menu-form">

      <div className="form-section">
        <h3 className="form-title">Add / Edit Menu</h3>

        <div className="form-group">
          <label>Name</label>
          <input />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea />
        </div>

        <div className="form-group">
          <label>Language</label>
          <div style={{ fontWeight: "bold" }}>
            {lang.toUpperCase()}
          </div>
        </div>

        <div className="form-group">
          <label>Menu Type</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="page">Page</option>
            <option value="blog">Blog</option>
            <option value="product">Product</option>
          </select>
        </div>

        <div className="form-group">
          <label>Group</label>
          <select
            value={form.groupId}
            onChange={e => setForm({ ...form, groupId: e.target.value })}
          >
            <option value="">Chọn group</option>

            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.danduong_nhom_tieude}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Parent Item</label>
          <select
            value={form.parentId || ""}
            onChange={e => setForm({ ...form, parentId: e.target.value })}
          >
            <option value="">None</option>

            {filteredParents.map(p => (
              <option key={p.id} value={p.id}>
                {"—".repeat(p.depth || 0)} {p.data?.ten || p.ten}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Target Window</label>
          <select>
            <option>Current</option>
            <option>New Window / Tab</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Publishing</label>
          <input type="datetime-local" />
        </div>

        <div className="form-group">
          <label>Finish Publishing</label>
          <input type="datetime-local" />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-title">Meta Data</h3>

        <div className="form-group">
          <label>Meta Title</label>
          <input />
        </div>

        <div className="form-group">
          <label>Meta Description</label>
          <textarea />
        </div>

        <div className="form-group">
          <label>Meta Keywords</label>
          <input />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input />
        </div>
      </div>

      <button className="btn-save">Save</button>

    </div>
  );
}