// src/admin/components/media/RenameFolderModal.jsx

import {
    Modal,
    Input
} from "antd";

import {
    useEffect,
    useState
} from "react";

export default function RenameFolderModal({
    open,
    folder,
    onCancel,
    onSubmit
}) {

    const [value, setValue] = useState("");

    useEffect(() => {

        setValue(
            folder?.name || ""
        );

    }, [folder]);

    return (

        <Modal
            open={open}
            title="Rename Folder"
            destroyOnClose
            onCancel={onCancel}
            onOk={() => {
                onSubmit(value);
            }}
        >

            <Input
                autoFocus
                placeholder="Folder name"
                value={value}
                onPressEnter={() => {
                    onSubmit(value);
                }}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />

        </Modal>

    );
}