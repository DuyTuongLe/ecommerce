import { useState, useEffect, useRef } from "react";
import { saveCssVariables } from "../../shared/services/storeApi";

const VAR_GROUPS = {
    "Primary": ["--color-primary", "--color-primary-light", "--color-primary-dark", "--color-primary-bg"],
    "Accent": ["--color-accent", "--color-accent-light"],
    "Text": ["--color-text", "--color-text-secondary", "--color-text-muted"],
    "Background": ["--color-bg", "--color-bg-card", "--color-bg-sidebar", "--color-bg-sidebar-hover", "--color-bg-sidebar-active"],
    "Border": ["--color-border", "--color-border-light"],
    "Status": ["--color-success", "--color-warning", "--color-danger", "--color-info"],
};

function getAllVarNames() {
    return Object.values(VAR_GROUPS).flat();
}

function readCurrentVars() {
    const style = getComputedStyle(document.documentElement);
    const vars = {};
    for (const name of getAllVarNames()) {
        vars[name] = style.getPropertyValue(name).trim();
    }
    return vars;
}

function applyVars(vars) {
    for (const [name, value] of Object.entries(vars)) {
        if (value) document.documentElement.style.setProperty(name, value);
    }
}

function clearInlineVars() {
    for (const name of getAllVarNames()) {
        document.documentElement.style.removeProperty(name);
    }
}

export default function ColorEditor({ onClose, savedVars, onSaved }) {
    const [vars, setVars] = useState({});
    const [original, setOriginal] = useState({});
    const [search, setSearch] = useState("");
    const [modified, setModified] = useState(0);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const current = readCurrentVars();
        setVars(current);
        setOriginal(current);
    }, []);

    function handleChange(name, value) {
        setVars((prev) => ({ ...prev, [name]: value }));
        document.documentElement.style.setProperty(name, value);
        setModified((m) => m + 1);
    }

    function handleReset() {
        clearInlineVars();
        if (savedVars) applyVars(savedVars);
        const current = readCurrentVars();
        setVars(current);
        setModified(0);
    }

    async function handleSave() {
        setSaving(true);
        try {
            await saveCssVariables(vars);
            setOriginal(vars);
            setModified(0);
            onSaved?.(vars);
            try { localStorage.setItem("css_variables", JSON.stringify(vars)); } catch {}
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    function handleExport() {
        let css = ":root {\n";
        for (const [name, value] of Object.entries(vars)) {
            if (value) css += `  ${name}: ${value};\n`;
        }
        css += "}";
        const blob = new Blob([css], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "css-variables.css";
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            const regex = /(--[\w-]+)\s*:\s*([^;]+)/g;
            let match;
            while ((match = regex.exec(text))) {
                const name = match[1].trim();
                const value = match[2].trim();
                if (getAllVarNames().includes(name)) {
                    handleChange(name, value);
                }
            }
        };
        reader.readAsText(file);
    }

    function handleClose() {
        if (modified > 0) {
            clearInlineVars();
            if (savedVars) applyVars(savedVars);
            else applyVars(original);
        }
        onClose();
    }

    const filteredGroups = Object.entries(VAR_GROUPS).map(([group, names]) => ({
        group,
        items: names.filter((n) => !search || n.includes(search.toLowerCase())),
    })).filter((g) => g.items.length > 0);

    return (
        <>
            <div
                onClick={handleClose}
                style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
                    zIndex: 9999,
                }}
            />
            <div
                style={{
                    position: "fixed", top: 0, right: 0, width: "min(500px, 80vw)",
                    height: "100%", background: "#fff",
                    boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
                    zIndex: 10000, display: "flex", flexDirection: "column",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "16px 20px", borderBottom: "1px solid #eee",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Color Variables Editor</h2>
                    <button
                        onClick={handleClose}
                        style={{
                            border: "none", background: "none", fontSize: 22,
                            cursor: "pointer", color: "#999", lineHeight: 1,
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{
                    padding: "10px 20px", borderBottom: "1px solid #eee",
                    display: "flex", gap: 8, alignItems: "center",
                }}>
                    <input
                        type="text"
                        placeholder="Search variables..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1, padding: "6px 10px", border: "1px solid #ddd",
                            borderRadius: 4, fontSize: 13, outline: "none",
                        }}
                    />
                    <button onClick={handleReset} title="Reset All" style={btnStyle}>↺</button>
                    <button onClick={handleExport} title="Export CSS" style={btnStyle}>⬇</button>
                    <button onClick={() => fileInputRef.current?.click()} title="Import" style={btnStyle}>⬆</button>
                    <input ref={fileInputRef} type="file" accept=".css,.txt" style={{ display: "none" }} onChange={handleImport} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: "auto", padding: "12px 20px" }}>
                    {filteredGroups.map(({ group, items }) => (
                        <div key={group} style={{ marginBottom: 20 }}>
                            <div style={{
                                fontSize: 12, fontWeight: 600, color: "#999",
                                textTransform: "uppercase", letterSpacing: 1,
                                marginBottom: 8, paddingBottom: 4,
                                borderBottom: "1px solid #f0f0f0",
                            }}>
                                {group}
                            </div>
                            {items.map((name) => (
                                <div key={name} style={{
                                    display: "flex", alignItems: "center",
                                    padding: "6px 0", gap: 10,
                                }}>
                                    <div style={{ flex: 1, fontSize: 13, color: "#333", fontFamily: "monospace" }}>
                                        {name}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 4,
                                            border: "1px solid #ddd",
                                            background: vars[name] || "#fff",
                                        }} />
                                        <input
                                            type="text"
                                            value={vars[name] || ""}
                                            onChange={(e) => handleChange(name, e.target.value)}
                                            style={{
                                                width: 110, padding: "4px 8px", fontSize: 12,
                                                border: "1px solid #ddd", borderRadius: 4,
                                                fontFamily: "monospace",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: "12px 20px", borderTop: "1px solid #eee",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ fontSize: 12, color: "#999" }}>
                        {modified > 0 ? `${modified} changes` : "No changes"}
                    </span>
                    <button
                        onClick={handleSave}
                        disabled={modified === 0 || saving}
                        style={{
                            padding: "8px 24px", border: "none", borderRadius: 6,
                            fontSize: 13, fontWeight: 600, cursor: modified > 0 ? "pointer" : "default",
                            background: modified > 0 ? "var(--color-primary, #2f456f)" : "#e0e0e0",
                            color: modified > 0 ? "#fff" : "#999",
                        }}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </>
    );
}

const btnStyle = {
    width: 32, height: 32, border: "1px solid #ddd", borderRadius: 4,
    background: "#fff", cursor: "pointer", fontSize: 16, display: "flex",
    alignItems: "center", justifyContent: "center",
};
