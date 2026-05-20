// src/admin/components/media/MediaPickerModal.jsx

import {

    Modal

} from "antd";

import MediaExplorer
    from "./MediaExplorer";

export default function MediaPickerModal({

    open,

    onCancel,

    onSelect

}) {

    return (

        <Modal

            open={open}

            onCancel={onCancel}

            footer={null}

            width={1200}

            title="Choose Media"

            style={{
                top: 16
            }}

        >

            <MediaExplorer

                mode="picker"

                onSelect={(media) => {

                    onSelect(media);

                    onCancel();

                }}

            />

        </Modal>

    );

}