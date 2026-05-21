// src/admin/components/media/CreateFolderModal.jsx

import {
    Modal,
    Input
} from "antd";

import {
    useEffect,
    useState
} from "react";

export default function CreateFolderModal({
    open,
    onCancel,
    onSubmit
}) {

    const [value, setValue] = useState("");

    useEffect(() => {

        if (open) {
            setValue("");
        }

    }, [open]);

    return (

        <Modal
            open={open}
            title="Create Folder"
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