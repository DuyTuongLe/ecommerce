//src/admin/components/media/EditMediaModal.jsx

import {

    Modal,
    Input,
    message

} from "antd";

import {

    useEffect,
    useState

} from "react";

export default function EditMediaModal({

    open,

    media,

    onCancel,

    onSubmit

}) {

    const [

        value,

        setValue

    ] = useState("");

    useEffect(() => {

        setValue(
            media?.alt || ""
        );

    }, [media]);

    function handleSubmit() {

        const trimmed =
            value.trim();

        // EMPTY

        if (!trimmed) {

            return message.error(
                "Alt text is required"
            );

        }

        // SPECIAL CHARACTERS

        const regex =
            /^[\p{L}\p{N}\s\-_]+$/u;

        if (!regex.test(trimmed)) {

            return message.error(
                "Alt text cannot contain special characters"
            );

        }

        onSubmit(trimmed);

    }

    return (

        <Modal

            open={open}

            title="Edit Media"

            destroyOnClose

            onCancel={onCancel}

            onOk={handleSubmit}

        >

            <Input

                autoFocus

                placeholder="Alt text"

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