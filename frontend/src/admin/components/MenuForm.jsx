export default function MenuForm() {
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
          <select>
            <option value="vi">Vietnamese</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="form-group">
          <label>Menu Type</label>
          <select>
            <option value="page">Page</option>
            <option value="blog">Blog</option>
            <option value="product">Product</option>
          </select>
        </div>

        <div className="form-group">
          <label>Group</label>
          <select>
            <option>Main Menu</option>
            <option>Footer Menu</option>
          </select>
        </div>

        <div className="form-group">
          <label>Parent Item</label>
          <select>
            <option>None</option>
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