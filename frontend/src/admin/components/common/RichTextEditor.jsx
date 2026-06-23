// src/admin/components/common/RichTextEditor.jsx

import { Editor } from "@tinymce/tinymce-react";

const DEFAULT_PLUGINS = [
    "advlist", "autolink", "lists", "link", "image",
    "charmap", "preview", "anchor", "searchreplace",
    "visualblocks", "code", "fullscreen",
    "insertdatetime", "media", "table", "help",
    "wordcount", "emoticons", "directionality",
];

const DEFAULT_TOOLBAR =
    "undo redo removeformat | blocks fontsize | " +
    "bold italic underline strikethrough | forecolor backcolor | " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist outdent indent | link image table media | " +
    "charmap emoticons hr | visualblocks code fullscreen";

export default function RichTextEditor({
    value = "",
    onChange,
    height = 400,
    disabled = false,
    placeholder = "",
    plugins = DEFAULT_PLUGINS,
    toolbar = DEFAULT_TOOLBAR,
    init = {},
}) {
    return (
        <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            disabled={disabled}
            value={value || ""}
            onEditorChange={(content) => onChange?.(content)}
            init={{
                license_key: "gpl",
                height,
                menubar: false,
                promotion: false,
                branding: false,
                statusbar: true,
                placeholder,
                toolbar_mode: "wrap",
                toolbar,
                plugins,
                visualblocks_default_state: true,
                block_formats:
                    "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; " +
                    "Heading 4=h4; Heading 5=h5; Heading 6=h6; " +
                    "Blockquote=blockquote; Preformatted=pre",
                font_size_formats:
                    "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt 60pt 72pt",
                ...init,
            }}
        />
    );
}
