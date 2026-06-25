import { useState, useRef, useEffect } from "react";
import { Select, Button, Tooltip, Tag } from "antd";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { filePickerCallback } from "../common/tinymceMediaPicker";
import ColumnStyleModal from "./ColumnStyleModal";

const SPAN_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}/12`,
}));

const SPAN_CLASS = {
    1: "col-span-1", 2: "col-span-2", 3: "col-span-3",
    4: "col-span-4", 5: "col-span-5", 6: "col-span-6",
    7: "col-span-7", 8: "col-span-8", 9: "col-span-9",
    10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
};

export { SPAN_CLASS };

const VIEWPORT_LABELS = {
    desktop: "Desktop",
    laptop: "Laptop",
    tablet: "Tablet",
    mobile: "Mobile",
};

const VIEWPORT_COLORS = {
    desktop: "blue",
    laptop: "cyan",
    tablet: "orange",
    mobile: "red",
};

const TOOLBAR_CONFIG =
    "undo redo removeformat | blocks fontsize | bold italic underline strikethrough | " +
    "alignleft aligncenter alignright alignjustify | forecolor backcolor | " +
    "bullist numlist outdent indent | link image table media | " +
    "charmap emoticons anchor hr | visualblocks code fullscreen";

const PLUGINS = [
    "advlist", "autolink", "lists", "link", "image",
    "charmap", "preview", "anchor", "searchreplace",
    "visualblocks", "code", "fullscreen",
    "insertdatetime", "media", "table", "help",
    "wordcount", "emoticons", "directionality",
    "accordion",
];

function getSpanForViewport(span, viewport) {
    if (typeof span === "number") return span;
    if (typeof span === "object" && span !== null) return span[viewport] ?? span.desktop ?? 6;
    return 6;
}

export default function GridColumn({
    column,
    viewport = "desktop",
    onChangeSpan,
    onChangeContent,
    onChangeStyle,
    onDelete,
    canDelete,
    toolbarContainerId,
    onEditorFocus,
    onEditorBlur,
}) {
    const [styleModalOpen, setStyleModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const editorRef = useRef(null);
    const onChangeContentRef = useRef(onChangeContent);
    const onEditorFocusRef = useRef(onEditorFocus);
    const onEditorBlurRef = useRef(onEditorBlur);

    onChangeContentRef.current = onChangeContent;
    onEditorFocusRef.current = onEditorFocus;
    onEditorBlurRef.current = onEditorBlur;

    const colStyle = column.style || {};
    const extraClasses = colStyle.classes || "";
    const colWrapClasses = colStyle.colClasses || "";
    const currentSpan = getSpanForViewport(column.span, viewport);
    const spanObj = typeof column.span === "object" ? column.span : null;

    function getContent() {
        return editorRef.current?.getContent() ?? "";
    }

    return (
        <div className={SPAN_CLASS[currentSpan] || "col-span-6"}>
            <div
                className={`grid-column-wrap ${colWrapClasses}`.trim()}
                style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    background: colStyle.bgColor && !colStyle.bgColor.startsWith("bg-")
                        ? colStyle.bgColor
                        : "#fff",
                    transition: "box-shadow 0.2s",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 8px",
                        background: "#f5f5f5",
                        borderBottom: "1px solid #e8e8e8",
                        borderRadius: "8px 8px 0 0",
                        fontSize: 11,
                        flexWrap: "wrap",
                    }}
                >
                    <Tag
                        color={VIEWPORT_COLORS[viewport]}
                        bordered={false}
                        style={{ margin: 0, fontSize: 10, lineHeight: "18px" }}
                    >
                        {VIEWPORT_LABELS[viewport]}
                    </Tag>

                    <Tooltip title={`Column width (${VIEWPORT_LABELS[viewport]})`}>
                        <Select
                            size="small"
                            value={currentSpan}
                            onChange={(val) => onChangeSpan(val, viewport)}
                            options={SPAN_OPTIONS}
                            style={{ width: 72 }}
                            variant="borderless"
                        />
                    </Tooltip>

                    <span style={{ color: "#bbb" }}>{SPAN_CLASS[currentSpan]}</span>

                    {spanObj && (
                        <span style={{ color: "#999", fontSize: 10 }}>
                            {["desktop", "laptop", "tablet", "mobile"]
                                .filter((vp) => vp !== viewport && spanObj[vp] != null)
                                .map((vp) => `${vp[0].toUpperCase()}:${spanObj[vp]}`)
                                .join(" ")}
                        </span>
                    )}

                    {extraClasses && (
                        <span style={{ color: "#1677ff", fontSize: 10, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {extraClasses}
                        </span>
                    )}
                    <span style={{ flex: 1 }} />

                    <Tooltip title="Column settings">
                        <Button
                            size="small"
                            type="text"
                            icon={<SettingOutlined />}
                            onClick={() => setStyleModalOpen(true)}
                        />
                    </Tooltip>

                    {canDelete && (
                        <Tooltip title="Delete column">
                            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
                        </Tooltip>
                    )}
                </div>

                <div
                    className={`ge-inline-editor ${extraClasses}`}
                    id={colStyle.id || undefined}
                    style={{ minHeight: 180 }}
                >
                    {mounted ? (
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            initialValue={column.content || ""}
                            onInit={(_, editor) => { editorRef.current = editor; editor.focus(); }}
                            init={{
                                license_key: "gpl",
                                inline: true,
                                menubar: false,
                                promotion: false,
                                branding: false,
                                statusbar: false,
                                toolbar_mode: "wrap",
                                toolbar: TOOLBAR_CONFIG,
                                plugins: PLUGINS,
                                fixed_toolbar_container: `#${toolbarContainerId}`,
                                fixed_toolbar_container_target: document.getElementById(toolbarContainerId),
                                file_picker_callback: filePickerCallback,
                                file_picker_types: "image",
                                image_advtab: true,
                                image_dimensions: true,
                                object_resizing: true,
                                visualblocks_default_state: true,
                                block_formats: "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Blockquote=blockquote; Preformatted=pre",
                                font_size_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt 60pt 72pt",
                                setup: (editor) => {
                                    editor.on("focus", () => {
                                        const wrap = editor.getElement()?.closest(".grid-column-wrap");
                                        if (wrap) wrap.style.boxShadow = "0 0 0 2px rgba(47,69,111,0.25)";
                                        onEditorFocusRef.current?.();
                                    });
                                    editor.on("blur", () => {
                                        const wrap = editor.getElement()?.closest(".grid-column-wrap");
                                        if (wrap) wrap.style.boxShadow = "none";
                                        onChangeContentRef.current?.(editor.getContent());
                                        onEditorBlurRef.current?.();
                                    });
                                },
                            }}
                        />
                    ) : (
                        <div
                            className="ge-editor-preview"
                            style={{ minHeight: 180, padding: 8, cursor: "text" }}
                            onClick={() => setMounted(true)}
                            dangerouslySetInnerHTML={{
                                __html: column.content || '<p style="color:#bbb">Bấm để soạn nội dung...</p>',
                            }}
                        />
                    )}
                </div>
            </div>

            <ColumnStyleModal
                open={styleModalOpen}
                style={colStyle}
                onSave={(newStyle) => {
                    onChangeStyle(newStyle);
                    setStyleModalOpen(false);
                }}
                onCancel={() => setStyleModalOpen(false)}
            />
        </div>
    );
}
