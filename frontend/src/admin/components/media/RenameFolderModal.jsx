// src/admin/components/media/RenameFolderModal.jsx

import {

    Modal,
    Input,
    message

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

    const [

        value,

        setValue

    ] = useState("");

    useEffect(() => {

        setValue(
            folder?.name || ""
        );

    }, [folder]);

    function handleSubmit() {

        const trimmed =
            value.trim();

        // EMPTY

        if (!trimmed) {

            return message.error(
                "Folder name is required"
            );

        }

        // SPECIAL CHARACTERS

        const regex =
            /^[\p{L}\p{N}\s\-_]+$/u;

        if (!regex.test(trimmed)) {

            return message.error(
                "Folder name cannot contain special characters"
            );

        }

        onSubmit(trimmed);

    }

    return (

        <Modal

            open={open}

            title="Rename Folder"

            destroyOnClose

            onCancel={onCancel}

            onOk={handleSubmit}

        >

            <Input

                autoFocus

                placeholder="Folder name"

                value={value}

                onPressEnter={
                    handleSubmit
                }

                onChange={(e) => {

                    setValue(
                        e.target.value
                    );

                }}

            />

        </Modal>

    );

}