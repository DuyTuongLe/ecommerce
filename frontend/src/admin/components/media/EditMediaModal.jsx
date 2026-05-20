//src/admin/components/media/EditMediaModal.jsx


import {

    Modal,
    Input

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

    return (

        <Modal

            open={open}

            title="Edit Media"

            destroyOnClose

            onCancel={onCancel}

            onOk={() => {

                onSubmit(value);

            }}

        >

            <Input

                autoFocus

                placeholder="Alt text"

                value={value}

                onChange={(e) => {

                    setValue(
                        e.target.value
                    );

                }}

            />

        </Modal>

    );

}