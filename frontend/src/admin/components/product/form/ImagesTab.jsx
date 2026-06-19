// src/admin/components/product/form/ImagesTab.jsx

import {
    Card,
    Row,
    Col,
    Button,
    Image,
    Space
} from "antd";

import {
    useState,
    useEffect
} from "react";

import {

    DeleteOutlined

} from "@ant-design/icons";

import MediaPickerModal
    from "../../media/MediaPickerModal";

export default function ImagesTab({
    product,
    form
}) {

    const [
        mediaModalOpen,
        setMediaModalOpen
    ] = useState(false);

    const [
        thumbnailPreview,
        setThumbnailPreview
    ] = useState(
        product?.thumbnail
    );

    const [
        galleryPreview,
        setGalleryPreview
    ] = useState([]);

    const [
        pickerMode,
        setPickerMode
    ] = useState(
        "thumbnail"
    );

    useEffect(() => {

        setThumbnailPreview(
            product?.thumbnail
        );

        setGalleryPreview(
            product?.gallery || []
        );

        form.setFieldValue(

            "thumbnail_id",

            product?.thumbnail?.id
            || null

        );

        form.setFieldValue(

            "gallery_ids",

            product?.gallery?.map(
                item => item.id
            ) || []

        );

    }, [

        product,

        form

    ]);

    function handleSelectMedia(
        media
    ) {

        // Thumbnail

        if (
            pickerMode ===
            "thumbnail"
        ) {

            form.setFieldValue(
                "thumbnail_id",
                media.id
            );

            setThumbnailPreview({

                id: media.id,

                url: media.url

            });

        }

        // Gallery

        if (
            pickerMode ===
            "gallery"
        ) {

            const nextGallery = [

                ...galleryPreview,

                media

            ];

            setGalleryPreview(
                nextGallery
            );

            form.setFieldValue(

                "gallery_ids",

                nextGallery.map(
                    item => item.id
                )

            );

        }

        setMediaModalOpen(
            false
        );

    }

    function handleRemoveGallery(
        imageId
    ) {

        const nextGallery =

            galleryPreview.filter(

                item =>
                    item.id !== imageId

            );

        setGalleryPreview(
            nextGallery
        );

        form.setFieldValue(

            "gallery_ids",

            nextGallery.map(
                item => item.id
            )

        );

    }

    return (

        <>

            <Row gutter={24}>

                {/* Thumbnail */}

                <Col span={8}>

                    <Card title="Thumbnail">

                        {

                            thumbnailPreview &&

                            <Image

                                width="100%"

                                src={
                                    thumbnailPreview.url
                                }

                            />

                        }

                        <br />
                        <br />

                        <Button

                            block

                            onClick={() => {

                                setPickerMode(
                                    "thumbnail"
                                );

                                setMediaModalOpen(
                                    true
                                );

                            }}

                        >

                            Select Thumbnail

                        </Button>

                    </Card>

                </Col>

                {/* Gallery */}

                <Col span={16}>

                    <Card title="Gallery">

                        <Space wrap>

                            {

                                galleryPreview.map(
                                    image => (

                                        <div

                                            key={image.id}

                                            style={{

                                                position: "relative"

                                            }}

                                        >

                                            <Image

                                                width={120}

                                                src={
                                                    image.url
                                                }

                                            />

                                            <Button

                                                danger

                                                size="small"

                                                style={{

                                                    position: "absolute",

                                                    top: 4,

                                                    right: 4,

                                                    zIndex: 10

                                                }}

                                                onClick={() =>

                                                    handleRemoveGallery(
                                                        image.id
                                                    )

                                                }

                                            >

                                                <DeleteOutlined />

                                            </Button>

                                        </div>

                                    )
                                )

                            }

                        </Space>

                        <br />
                        <br />

                        <Button

                            onClick={() => {

                                setPickerMode(
                                    "gallery"
                                );

                                setMediaModalOpen(
                                    true
                                );

                            }}

                        >

                            Add Images

                        </Button>

                    </Card>

                </Col>

            </Row>

            <MediaPickerModal

                open={
                    mediaModalOpen
                }

                onCancel={() => {

                    setMediaModalOpen(
                        false
                    );

                }}

                onSelect={
                    handleSelectMedia
                }

            />

        </>

    );

}