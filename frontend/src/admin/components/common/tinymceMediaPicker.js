import { requestMediaPicker } from "./mediaPickerBridge";

export function filePickerCallback(callback, _value, meta) {
    if (meta.filetype === "image") {
        requestMediaPicker().then((media) => {
            if (media) {
                callback(media.url, { alt: media.alt || media.filename || "" });
            }
        });
    }
}
