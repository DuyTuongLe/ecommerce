let _resolve = null;

export function requestMediaPicker() {
    return new Promise((resolve) => {
        _resolve = resolve;
        window.dispatchEvent(new CustomEvent("open-media-picker"));
    });
}

export function resolveMediaPicker(media) {
    if (_resolve) {
        _resolve(media);
        _resolve = null;
    }
}

export function cancelMediaPicker() {
    if (_resolve) {
        _resolve(null);
        _resolve = null;
    }
}
