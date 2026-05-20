//src/admin/components/MediaPickerModal.jsx

import {

    Modal,
    Row,
    Col,
    Card,
    Image,
    Spin,
    Empty,
    Button,
    Space

} from "antd";

import {

    useEffect,
    useState

} from "react";

import {

    getMediaExplorer

} from "../../shared/services/mediaApi";

import {

    FolderFilled,
    ArrowLeftOutlined

} from "@ant-design/icons";

export default function MediaPickerModal({

    open,

    onCancel,

    onSelect

}) {

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        media,

        setMedia

    ] = useState([]);

    const [

        folders,

        setFolders

    ] = useState([]);

    const [

        currentFolderId,

        setCurrentFolderId

    ] = useState(null);

    const [

        currentFolder,

        setCurrentFolder

    ] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | FETCH MEDIA
    |--------------------------------------------------------------------------
    */

    async function fetchMedia() {
        try {

            setLoading(true);

            const data =
                await getMediaExplorer(
                    currentFolderId
                );

            setMedia(
                data.media || []
            );

            setFolders(
                data.folders || []
            );

            setCurrentFolder(
                data.current_folder || null
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    /*
    |--------------------------------------------------------------------------
    | EFFECT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {
            return;
        }

        fetchMedia();

    }, [open, currentFolderId]);

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <Modal

            open={open}

            onCancel={onCancel}

            footer={null}

            width={1000}

            title="Choose Media"

        >

            {
                loading ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: 60
                        }}
                    >

                        <Spin />

                    </div>

                ) : (

                    <>

                        {
                            currentFolder && (

                                <Button

                                    icon={
                                        <ArrowLeftOutlined />
                                    }

                                    onClick={() => {

                                        setCurrentFolderId(
                                            currentFolder.parent_id
                                        );

                                    }}

                                    style={{
                                        marginBottom: 20
                                    }}

                                >

                                    Back

                                </Button>

                            )
                        }


                        <Row gutter={[16, 16]}>

                            {
                                folders.map(folder => (

                                    <Col
                                        key={folder.id}
                                        xs={12}
                                        md={6}
                                    >

                                        <Card

                                            hoverable

                                            onClick={() => {

                                                setCurrentFolderId(
                                                    folder.id
                                                );

                                            }}

                                            styles={{

                                                body: {

                                                    textAlign: "center",

                                                    padding: 24

                                                }

                                            }}

                                        >

                                            <FolderFilled

                                                style={{

                                                    fontSize: 48,

                                                    color: "#faad14",

                                                    marginBottom: 12

                                                }}

                                            />

                                            <div>
                                                {folder.name}
                                            </div>

                                        </Card>

                                    </Col>

                                ))
                            }

                            {
                                media.map(item => (

                                    <Col
                                        key={item.id}
                                        xs={12}
                                        md={6}
                                    >

                                        <Card

                                            hoverable

                                            onClick={() => {

                                                onSelect(item);

                                            }}

                                            styles={{

                                                body: {
                                                    padding: 10
                                                }

                                            }}

                                        >

                                            <Image

                                                src={item.url}

                                                preview={false}

                                                style={{

                                                    width: "100%",

                                                    height: 160,

                                                    objectFit:
                                                        "cover",

                                                    borderRadius: 10

                                                }}

                                            />

                                        </Card>

                                    </Col>

                                ))
                            }

                        </Row>

                        {
                            folders.length === 0 &&
                            media.length === 0 && (

                                <Empty
                                    style={{
                                        marginTop: 40
                                    }}
                                />

                            )
                        }
                    </>

                )
            }

        </Modal>

    );

}