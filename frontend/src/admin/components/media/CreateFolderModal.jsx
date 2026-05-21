// src/admin/components/media/CreateFolderModal.jsx

import {

    Modal,
    Input,
    message

} from "antd";

import {

    useState

} from "react";

export default function CreateFolderModal({

    open,

    onCancel,

    onSubmit

}) {

    const [

        value,

        setValue

    ] = useState("");

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

        setValue("");

    }

    return (

        <Modal

            open={open}

            title="Create Folder"

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