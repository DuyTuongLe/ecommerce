//src/admin/components/media/MediaExplorer.jsx


import {

    useState,
    useEffect,
    useRef,
    useMemo

} from "react";

import {

    Row,
    Col,
    Card,
    Button,
    Breadcrumb,
    Input,
    Upload,
    Space,
    Typography,
    Image,
    Modal,
    Popconfirm,
    message

} from "antd";

import {

    FolderFilled,
    ArrowLeftOutlined,
    UploadOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
    EyeOutlined,
    EditOutlined

} from "@ant-design/icons";

import {

    getMediaExplorer,
    createMediaFolder,
    updateMediaFolder,
    deleteMediaFolder,
    uploadMedia,
    deleteMedia,
    updateMedia

} from "../../../shared/services/mediaApi";

import EditMediaModal from "./EditMediaModal";
import CreateFolderModal from "./CreateFolderModal";
import RenameFolderModal from "./RenameFolderModal";


const { Dragger } =
    Upload;

const { Text } =
    Typography;

export default function MediaExplorer({

    mode = "manager",

    onSelect = null

}) {

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    const [

        currentFolderId,

        setCurrentFolderId

    ] = useState(null);

    const [

        currentFolder,

        setCurrentFolder

    ] = useState(null);

    const [

        search,

        setSearch

    ] = useState("");

    const [folders, setFolders] =
        useState([]);

    const [media, setMedia] =
        useState([]);

    const [

        folderModalOpen,

        setFolderModalOpen

    ] = useState(false);

    const [

        previewImage,

        setPreviewImage

    ] = useState(null);

    const [

        editingFolder,

        setEditingFolder

    ] = useState(null);

    const [

        renameModalOpen,

        setRenameModalOpen

    ] = useState(false);

    const [

        editingMedia,

        setEditingMedia

    ] = useState(null);

    const [

        mediaModalOpen,

        setMediaModalOpen

    ] = useState(false);
    /*
    |--------------------------------------------------------------------------
    | FILTERED MEDIA
    |--------------------------------------------------------------------------
    */

    const filteredMedia = useMemo(() => {

        return media.filter(item => {

            return item.alt

                ?.toLowerCase()

                ?.includes(

                    search.toLowerCase()

                );

        });

    }, [

        media,

        search

    ]);

    /*
    |--------------------------------------------------------------------------
    | FETCH EXPLORER
    |--------------------------------------------------------------------------
    */

    async function fetchExplorer(
        folderId = null
    ) {

        try {

            const data =
                await getMediaExplorer(
                    folderId
                );

            setFolders(
                data.folders || []
            );

            setMedia(
                data.media || []
            );

            setCurrentFolder(
                data.current_folder || null
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Load explorer failed"
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | CREATE FOLDER
    |--------------------------------------------------------------------------
    */

    async function handleCreateFolder(value) {

        try {

            await createMediaFolder({

                name: value,

                parent_id:
                    currentFolderId

            });

            fetchExplorer(
                currentFolderId
            );

            /*
            |--------------------------------------------------------------------------
            | Reset
            |--------------------------------------------------------------------------
            */

            setFolderModalOpen(
                false
            );

            message.success(
                "Folder created"
            );

        } catch (error) {

            console.error(error);

            if (

                error?.response?.data
                    ?.errors?.name?.[0]

            ) {

                message.error(

                    error.response.data
                        .errors.name[0]

                );

            } else {

                message.error(
                    "Create folder failed"
                );

            }

        }

    }

    async function handleRenameFolder(value) {

        try {

            await updateMediaFolder(

                editingFolder.id,

                {

                    name: value

                }

            );

            message.success(
                "Folder updated"
            );

            setRenameModalOpen(
                false
            );

            setEditingFolder(
                null
            );

            fetchExplorer(
                currentFolderId
            );

        } catch (error) {

            console.error(error);

            if (

                error?.response?.data
                    ?.errors?.name?.[0]

            ) {

                message.error(

                    error.response.data
                        .errors.name[0]

                );

            } else {

                message.error(
                    "Rename failed"
                );

            }

        }

    }

    async function handleDeleteFolder(
        folder
    ) {

        try {

            await deleteMediaFolder(
                folder.id
            );

            message.success(
                "Folder deleted"
            );

            fetchExplorer(
                currentFolderId
            );

        } catch (error) {

            console.error(error);

            message.error(

                error?.response?.data
                    ?.message ||

                "Delete failed"

            );

        }

    }

    async function handleDeleteMedia(
        media
    ) {

        try {

            await deleteMedia(
                media.id
            );

            message.success(
                "Media deleted"
            );

            fetchExplorer(
                currentFolderId
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Delete media failed"
            );

        }

    }

    async function handleUpdateMedia(
        value
    ) {

        try {

            await updateMedia(

                editingMedia.id,

                {

                    alt: value

                }

            );

            setMedia(prev =>

                prev.map(item =>

                    item.id === editingMedia.id

                        ? {

                            ...item,

                            alt: value

                        }

                        : item

                )

            );

            message.success(
                "Media updated"
            );

            setMediaModalOpen(
                false
            );

            setEditingMedia(
                null
            );
        } catch (error) {

            console.error(error);

            message.error(
                "Update media failed"
            );

        }

    }

    async function handleUpload(
        options
    ) {

        try {

            const {
                file
            } = options;

            /*
            |--------------------------------------------------------------------------
            | Form Data
            |--------------------------------------------------------------------------
            */

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            if (
                currentFolderId
            ) {

                formData.append(

                    "folder_id",

                    currentFolderId

                );

            }

            /*
            |--------------------------------------------------------------------------
            | Upload
            |--------------------------------------------------------------------------
            */

            await uploadMedia(
                formData
            );

            /*
            |--------------------------------------------------------------------------
            | Reload
            |--------------------------------------------------------------------------
            */

            fetchExplorer(
                currentFolderId
            );

            message.success(
                "Upload success"
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Upload failed"
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | OPEN FOLDER
    |--------------------------------------------------------------------------
    */

    function handleOpenFolder(
        folder
    ) {

        setCurrentFolderId(
            folder.id
        );

    }

    /*
    |--------------------------------------------------------------------------
    | BACK
    |--------------------------------------------------------------------------
    */

    function handleBack() {

        if (!currentFolder) {
            return;
        }

        setCurrentFolderId(
            currentFolder.parent_id
        );

    }

    /*
    |--------------------------------------------------------------------------
    | EFFECT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchExplorer(
            currentFolderId
        );

    }, [

        currentFolderId

    ]);

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */
    const folderHoverStyle = `
        .folder-card:hover .folder-overlay{
            opacity:1 !important;
        }
        .folder-card{
            transition: all .25s ease;
        }
        .folder-card:hover{
            transform: translateY(-4px);
        }
    `;
    return (

        <>

            <style>
                {folderHoverStyle}
            </style>

            <div>

                {/* HEADER */}

                <div

                    style={{

                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems: "center",

                        marginBottom: 24,

                        gap: 16,

                        flexWrap: "wrap"

                    }}

                >

                    {/* LEFT */}

                    <Space size={16}>

                        <Button

                            icon={
                                <ArrowLeftOutlined />
                            }

                            disabled={
                                !currentFolder
                            }

                            onClick={handleBack}

                        >

                            Back

                        </Button>

                        <Breadcrumb

                            items={[

                                {

                                    title: (

                                        <span

                                            style={{

                                                cursor:
                                                    "pointer",

                                                fontWeight: 600

                                            }}

                                            onClick={() => {

                                                setCurrentFolderId(
                                                    null
                                                );

                                            }}

                                        >

                                            Media Manager

                                        </span>

                                    )

                                },

                                ...(currentFolder

                                    ? [

                                        {

                                            title:
                                                currentFolder.name

                                        }

                                    ]

                                    : [])

                            ]}

                        />

                    </Space>

                    {/* RIGHT */}

                    <Space>

                        <Button

                            type="primary"

                            icon={
                                <PlusOutlined />
                            }
                            onClick={() => {
                                setFolderModalOpen(true);
                            }}
                        >
                            New Folder

                        </Button>

                        <Input

                            allowClear

                            placeholder="Search media..."

                            prefix={
                                <SearchOutlined />
                            }

                            value={search}

                            onChange={e => {

                                setSearch(
                                    e.target.value
                                );

                            }}

                            style={{
                                width: 260
                            }}

                        />

                    </Space>

                </div>

                {/* DRAGGER */}

                <Dragger

                    customRequest={
                        handleUpload
                    }

                    showUploadList={
                        false
                    }

                    multiple

                    style={{

                        marginBottom: 24,

                        borderRadius: 16,

                        overflow: "hidden"

                    }}

                >

                    <p className="ant-upload-drag-icon">

                        <UploadOutlined
                            style={{
                                fontSize: 42
                            }}
                        />

                    </p>

                    <p className="ant-upload-text">

                        Drag & Drop files here

                    </p>

                    <p className="ant-upload-hint">

                        Upload images, videos,
                        documents...

                    </p>

                </Dragger>

                {/* EXPLORER */}
                <div
                    style={{
                        height: "calc(100vh - 320px)",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: 4,

                    }}
                >


                    <Row gutter={[20, 20]}>

                        {/* FOLDERS */}

                        {

                            folders.map(folder => (

                                <Col

                                    key={folder.id}

                                    xs={12}
                                    sm={8}
                                    md={6}
                                    lg={4}

                                >

                                    <Card
                                        className="folder-card"
                                        hoverable
                                        bodyStyle={{

                                            padding: 12,

                                            height: "100%"

                                        }}

                                        onClick={() => {

                                            handleOpenFolder(
                                                folder
                                            );

                                        }}

                                        style={{

                                            borderRadius: 12,

                                            border:
                                                "1px solid #f0f0f0",

                                            overflow:
                                                "hidden",

                                            boxShadow:
                                                "0 2px 12px rgba(0,0,0,0.04)",

                                            position:
                                                "relative",

                                            cursor: "pointer"

                                        }}
                                    >

                                        {/* OVERLAY */}

                                        <div

                                            className="folder-overlay"

                                            style={{

                                                position:
                                                    "absolute",

                                                inset: 0,

                                                background:
                                                    "rgba(0,0,0,.55)",

                                                display: "flex",

                                                flexDirection:
                                                    "column",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                gap: 14,

                                                opacity: 0,

                                                transition:
                                                    ".25s ease",

                                                zIndex: 2

                                            }}

                                        >

                                            {/* NAME */}

                                            <div

                                                style={{

                                                    color: "#fff",

                                                    fontWeight: 700,

                                                    fontSize: 18,

                                                    textAlign: "center",

                                                    paddingInline: 10

                                                }}

                                            >

                                                {folder.name}

                                            </div>

                                            {/* ACTIONS */}

                                            <Space
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >

                                                {/* EDIT */}

                                                <Button

                                                    shape="circle"

                                                    icon={
                                                        <EditOutlined />
                                                    }

                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setEditingFolder(
                                                            folder
                                                        );

                                                        setRenameModalOpen(
                                                            true
                                                        );

                                                    }}

                                                />

                                                {/* DELETE */}

                                                <Popconfirm

                                                    title="Delete folder?"

                                                    description="This action cannot be undone"

                                                    okText="Delete"

                                                    cancelText="Cancel"

                                                    onConfirm={(e) => {

                                                        e?.stopPropagation();

                                                        handleDeleteFolder(
                                                            folder
                                                        );

                                                    }}

                                                >

                                                    <Button

                                                        danger

                                                        shape="circle"

                                                        icon={
                                                            <DeleteOutlined />
                                                        }

                                                        onClick={(e) => {

                                                            e.stopPropagation();

                                                        }}

                                                    />

                                                </Popconfirm>

                                            </Space>


                                        </div>
                                        {/* CONTENT */}
                                        <div

                                            style={{

                                                textAlign: "center",

                                                height: 180,

                                                display: "flex",

                                                flexDirection: "column",

                                                alignItems: "center",

                                                justifyContent: "center"

                                            }}

                                        >
                                            <FolderFilled
                                                style={{
                                                    fontSize: 60,
                                                    color:
                                                        "#faad14"
                                                }}
                                            />
                                            <div
                                                style={{
                                                    marginTop: 10
                                                }}
                                            >
                                                <Text
                                                    strong
                                                    style={{
                                                        fontSize: 15
                                                    }}
                                                >
                                                    {folder.name}
                                                </Text>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))
                        }
                        {/* MEDIA */}
                        {
                            filteredMedia.map(item => (
                                <Col
                                    key={item.id}
                                    xs={12}
                                    sm={8}
                                    md={6}
                                    lg={4}
                                >
                                    <Card
                                        hoverable
                                        onClick={() => {
                                            if (
                                                mode === "picker" &&
                                                onSelect
                                            ) {

                                                onSelect(item);

                                                return;

                                            }

                                        }}
                                        style={{
                                            borderRadius: 12,
                                            overflow:
                                                "hidden",
                                            border:
                                                "1px solid #f0f0f0",
                                            boxShadow:
                                                "0 2px 12px rgba(0,0,0,0.04)",
                                            cursor:
                                                mode === "picker"
                                                    ? "pointer"
                                                    : "default"
                                        }}
                                        bodyStyle={{
                                            padding: 8
                                        }}
                                    >
                                        {/* IMAGE */}
                                        <div
                                            style={{
                                                position:
                                                    "relative"
                                            }}
                                        >
                                            <Image
                                                src={item.url}
                                                alt=""
                                                preview={
                                                    mode === "manager"
                                                }
                                                style={{
                                                    width: "100%",
                                                    height: 180,
                                                    objectFit:
                                                        "cover",
                                                    borderRadius: 4
                                                }}
                                            />
                                            {/* ACTIONS */}

                                            <div
                                                style={{

                                                    position:
                                                        "absolute",

                                                    top: 10,

                                                    right: 10,

                                                    display:
                                                        "flex",

                                                    gap: 8

                                                }}
                                            >

                                                {/* PREVIEW */}

                                                <Button

                                                    shape="circle"

                                                    size="small"

                                                    icon={
                                                        <EyeOutlined />
                                                    }

                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setPreviewImage(
                                                            item.url
                                                        );

                                                    }}

                                                />
                                                <Button

                                                    shape="circle"

                                                    size="small"

                                                    icon={
                                                        <EditOutlined />
                                                    }

                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setEditingMedia(
                                                            item
                                                        );

                                                        setMediaModalOpen(
                                                            true
                                                        );

                                                    }}

                                                />
                                                {/* DELETE */}

                                                <Popconfirm
                                                    title="Delete media?"
                                                    description="This action cannot be undone"
                                                    okText="Delete"
                                                    cancelText="Cancel"
                                                    onConfirm={(e) => {

                                                        e?.stopPropagation();

                                                        handleDeleteMedia(
                                                            item
                                                        );

                                                    }}
                                                >

                                                    <Button
                                                        danger
                                                        size="small"
                                                        shape="circle"
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        onClick={(e) => {

                                                            e.stopPropagation();

                                                        }}
                                                    />

                                                </Popconfirm>


                                            </div>
                                        </div>
                                        {/* INFO */}
                                        <div
                                            style={{
                                                marginTop: 12
                                            }}
                                        >
                                            <Text
                                                strong
                                                ellipsis
                                            >
                                                {item.alt}
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </div>
                <CreateFolderModal

                    open={folderModalOpen}

                    onCancel={() => {
                        setFolderModalOpen(false);
                    }}

                    onSubmit={(value) => {
                        handleCreateFolder(value);
                    }}

                />

                <RenameFolderModal

                    open={renameModalOpen}

                    folder={editingFolder}

                    onCancel={() => {
                        setRenameModalOpen(false);
                    }}

                    onSubmit={(value) => {
                        handleRenameFolder(value);
                    }}

                />
                <EditMediaModal

                    open={mediaModalOpen}

                    media={editingMedia}

                    onCancel={() => {

                        setMediaModalOpen(
                            false
                        );

                    }}

                    onSubmit={(value) => {

                        handleUpdateMedia(
                            value
                        );

                    }}

                />
                <Modal

                    open={!!previewImage}

                    footer={null}

                    onCancel={() => {

                        setPreviewImage(
                            null
                        );

                    }}

                    width={1000}

                >

                    <Image

                        src={previewImage}

                        preview={false}

                        style={{
                            width: "100%",
                            padding: 50,
                        }}

                    />

                </Modal>
            </div >
        </>
    );
}