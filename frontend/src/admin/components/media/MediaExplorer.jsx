//src/admin/components/media/MediaExplorer.jsx

import {


    useState,
    useEffect,
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
    EditOutlined


} from "@ant-design/icons";

import {


    getMediaExplorer,
    createMediaFolder,
    updateMediaFolder,
    deleteMediaFolder,
    uploadMedia,
    deleteMedia,
    updateMedia,
    moveMedia,
    moveFolder


} from "../../../shared/services/mediaApi";

import {


    DndContext,
    PointerSensor,
    useSensor,
    useSensors


} from "@dnd-kit/core";

import EditMediaModal
    from "./EditMediaModal";

import CreateFolderModal
    from "./CreateFolderModal";

import RenameFolderModal
    from "./RenameFolderModal";

import DraggableMediaCard
    from "./DraggableMediaCard";

import DroppableFolderCard
    from "./DroppableFolderCard";

const { Dragger } =
    Upload;

const { Text } =
    Typography;

export default function MediaExplorer({
    mode = "manager",
    onSelect = null
}) {

    const sensors = useSensors(

        useSensor(

            PointerSensor,

            {

                activationConstraint: {

                    distance: 8

                }

            }

        )

    );

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

        selectedMediaIds,

        setSelectedMediaIds

    ] = useState([]);

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

    const [

        moveModalOpen,

        setMoveModalOpen

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

            setFolderModalOpen(
                false
            );

            message.success(
                "Folder created"
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Create folder failed"
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | RENAME FOLDER
    |--------------------------------------------------------------------------
    */

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

            message.error(
                "Rename failed"
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | DELETE FOLDER
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | DELETE MEDIA
    |--------------------------------------------------------------------------
    */

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

    /*
|--------------------------------------------------------------------------
| BULK DELETE MEDIA
|--------------------------------------------------------------------------
*/

    async function handleBulkDelete() {

        try {

            await Promise.all(

                selectedMediaIds.map(id =>

                    deleteMedia(id)

                )

            );

            message.success(
                "Selected media deleted"
            );

            /*
            |--------------------------------------------------------------------------
            | CLEAR SELECT
            |--------------------------------------------------------------------------
            */

            setSelectedMediaIds([]);

            /*
            |--------------------------------------------------------------------------
            | REFRESH
            |--------------------------------------------------------------------------
            */

            fetchExplorer(
                currentFolderId
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Bulk delete failed"
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE MEDIA
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | UPLOAD
    |--------------------------------------------------------------------------
    */

    async function handleUpload(
        options
    ) {

        try {

            const {
                file
            } = options;

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

            await uploadMedia(
                formData
            );

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


    function handleToggleSelectMedia(
        mediaId
    ) {

        setSelectedMediaIds(prev => {

            if (
                prev.includes(mediaId)
            ) {

                return prev.filter(
                    id => id !== mediaId
                );

            }

            return [
                ...prev,
                mediaId
            ];

        });

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
    | STYLE
    |--------------------------------------------------------------------------
    */

    const folderHoverStyle = `


    .folder-card:hover .folder-overlay{
        opacity:1 !important;
    }

    .folder-card{
        transition: all .25s ease;
    }

    
`;

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={async (event) => {

                const {

                    active,

                    over

                } = event;

                if (
                    !over
                ) {
                    return;
                }

                const isFolderDrag =
                    active.id.startsWith(
                        "folder-drag-"
                    );

                /*
|--------------------------------------------------------------------------
| FOLDER DRAG
|--------------------------------------------------------------------------
*/

                if (isFolderDrag) {

                    const folderDragId = Number(

                        active.id.replace(
                            "folder-drag-",
                            ""
                        )

                    );

                    const parentId =

                        over.id === "back-folder"

                            ? currentFolder.parent_id

                            : Number(

                                over.id
                                    .replace(
                                        "folder-drag-",
                                        ""
                                    )
                                    .replace(
                                        "folder-",
                                        ""
                                    )

                            );

                    /*
                    |--------------------------------------------------------------------------
                    | SAME FOLDER
                    |--------------------------------------------------------------------------
                    */

                    if (
                        folderDragId === parentId
                    ) {

                        return;

                    }

                    try {

                        await moveFolder({

                            folder_id:
                                folderDragId,

                            parent_id:
                                parentId

                        });

                        message.success(
                            "Folder moved"
                        );

                        fetchExplorer(
                            currentFolderId
                        );

                    } catch (error) {

                        console.error(error);

                    }

                    return;

                }



                /*
                |--------------------------------------------------------------------------
                | MEDIA DRAG
                |--------------------------------------------------------------------------
                */

                const mediaId = Number(

                    active.id.replace(
                        "media-",
                        ""
                    )

                );

                const folderId =

                    over.id === "back-folder"

                        ? currentFolder.parent_id

                        : Number(

                            over.id.replace(
                                "folder-",
                                ""
                            )

                        );

                try {

                    await moveMedia({

                        media_ids:

                            selectedMediaIds.includes(
                                mediaId
                            )

                                ? selectedMediaIds

                                : [mediaId],

                        folder_id:
                            folderId

                    });

                    message.success(
                        "Media moved"
                    );

                    setMedia(prev =>

                        prev.filter(item =>

                        (

                            selectedMediaIds.includes(
                                mediaId
                            )

                                ? !selectedMediaIds.includes(
                                    item.id
                                )

                                : item.id !== mediaId

                        )

                        )

                    );
                    setSelectedMediaIds([]);
                } catch (error) {

                    console.error(error);

                    message.error(
                        "Move failed"
                    );

                }

            }}

        >
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

                            {

                                selectedMediaIds.length > 0 && (
                                    <>



                                        <Popconfirm

                                            title="Delete selected media?"

                                            onConfirm={() => {

                                                handleBulkDelete();

                                            }}

                                        >

                                            <Button

                                                danger

                                                icon={
                                                    <DeleteOutlined />
                                                }

                                            >

                                                Delete (
                                                {selectedMediaIds.length}
                                                )

                                            </Button>



                                        </Popconfirm>
                                    </>
                                )

                            }
                            <Button

                                onClick={() => {

                                    /*
                                    |--------------------------------------------------------------------------
                                    | TOGGLE SELECT ALL
                                    |--------------------------------------------------------------------------
                                    */

                                    if (

                                        selectedMediaIds.length ===
                                        filteredMedia.length

                                    ) {

                                        setSelectedMediaIds([]);

                                        return;

                                    }

                                    setSelectedMediaIds(

                                        filteredMedia.map(
                                            item => item.id
                                        )

                                    );

                                }}

                            >

                                {

                                    selectedMediaIds.length === filteredMedia.length

                                        ? "Clear"

                                        : "Select All"

                                }

                            </Button>
                            <Button

                                type="primary"

                                icon={
                                    <PlusOutlined />
                                }

                                onClick={() => {

                                    setFolderModalOpen(
                                        true
                                    );

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
                        className="media-explorer-container"
                        onClick={(e) => {

                            /*
                            |--------------------------------------------------------------------------
                            | CLICK EMPTY AREA
                            |--------------------------------------------------------------------------
                            */

                            if (

                                !e.target.closest(
                                    ".media-item"
                                )

                            ) {

                                setSelectedMediaIds([]);

                            }

                        }}
                        style={{

                            height:
                                "calc(-260px + 100vh)",

                            overflowY: "auto",

                            overflowX: "hidden",

                            paddingRight: 4

                        }}

                    >

                        <Row gutter={[20, 20]}>

                            {/* FOLDERS */}
                            {

                                currentFolder && (

                                    <Col
                                        xs={12}
                                        sm={8}
                                        md={6}
                                        lg={4}
                                    >

                                        <DroppableFolderCard
                                            id="back-folder"
                                        >

                                            <Card
                                                className="media-item"
                                                hoverable

                                                onClick={handleBack}

                                                style={{

                                                    borderRadius: 12,

                                                    border:
                                                        "1px solid #f0f0f0",

                                                    overflow:
                                                        "hidden",

                                                    boxShadow:
                                                        "0 2px 12px rgba(0,0,0,0.04)",

                                                    cursor: "pointer",

                                                    aspectRatio:
                                                        "1 / 1"

                                                }}

                                                bodyStyle={{

                                                    padding: 12,

                                                    height: "100%"

                                                }}

                                            >

                                                <div

                                                    style={{

                                                        textAlign: "center",

                                                        height: "100%",

                                                        display: "flex",

                                                        flexDirection:
                                                            "column",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "center"

                                                    }}

                                                >

                                                    <ArrowLeftOutlined

                                                        style={{

                                                            fontSize: 52,

                                                            color: "#1677ff"

                                                        }}

                                                    />

                                                    <div
                                                        style={{
                                                            marginTop: 12
                                                        }}
                                                    >

                                                        <Text
                                                            strong
                                                        >

                                                            Back

                                                        </Text>

                                                    </div>

                                                </div>

                                            </Card>

                                        </DroppableFolderCard>

                                    </Col>

                                )

                            }
                            {

                                folders.map(folder => (

                                    <Col
                                        key={folder.id}
                                        xs={12}
                                        sm={8}
                                        md={6}
                                        lg={4}
                                    >
                                        <DroppableFolderCard
                                            id={folder.id}
                                        >
                                            <Card

                                                className="folder-card media-item"

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

                                                    cursor: "pointer",

                                                    aspectRatio:
                                                        "1 / 1"

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

                                                    <Space>

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

                                                        <Popconfirm

                                                            title="Delete folder?"

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

                                                        height: "100%",

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
                                        </DroppableFolderCard>
                                    </Col>

                                ))

                            }

                            {/* MEDIA */}

                            {

                                filteredMedia.map(item => {

                                    const isSelected =
                                        selectedMediaIds.includes(
                                            item.id
                                        );

                                    return (

                                        <Col
                                            key={item.id}
                                            xs={12}
                                            sm={8}
                                            md={6}
                                            lg={4}
                                        >
                                            <DraggableMediaCard
                                                id={item.id}
                                            >
                                                {({
                                                    listeners,
                                                    attributes
                                                }) => (

                                                    <Card

                                                        hoverable

                                                        style={{

                                                            borderRadius: 12,

                                                            overflow:
                                                                "hidden",
                                                            touchAction: "none",

                                                            border:

                                                                isSelected

                                                                    ? "2px solid #1677ff"

                                                                    : "1px solid #f0f0f0",

                                                            boxShadow:
                                                                "0 2px 12px rgba(0,0,0,0.04)",

                                                            aspectRatio:
                                                                "1 / 1"

                                                        }}

                                                        bodyStyle={{

                                                            padding: 0,

                                                            height: "100%"

                                                        }}

                                                    >

                                                        {/* IMAGE */}

                                                        <div
                                                            {...listeners}

                                                            {...attributes}
                                                            style={{

                                                                position:
                                                                    "relative",

                                                                aspectRatio:
                                                                    "1 / 1",

                                                                overflow:
                                                                    "hidden"

                                                            }}

                                                        >

                                                            <Image

                                                                src={item.url}

                                                                alt=""

                                                                preview

                                                                width="100%"

                                                                height="100%"

                                                                style={{

                                                                    objectFit:
                                                                        "cover"

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

                                                                    gap: 8,

                                                                    zIndex: 2

                                                                }}

                                                            >
                                                                <Button

                                                                    type={
                                                                        isSelected
                                                                            ? "primary"
                                                                            : "default"
                                                                    }

                                                                    shape="circle"

                                                                    size="small"

                                                                    onClick={(e) => {

                                                                        e.stopPropagation();

                                                                        handleToggleSelectMedia(
                                                                            item.id
                                                                        );

                                                                    }}

                                                                >

                                                                    ✓

                                                                </Button>

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

                                                                <Popconfirm

                                                                    title="Delete media?"

                                                                    onConfirm={() => {

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

                                                            {/* ALT OVERLAY */}

                                                            <div

                                                                style={{

                                                                    position:
                                                                        "absolute",

                                                                    left: 0,

                                                                    right: 0,

                                                                    bottom: 0,

                                                                    padding:
                                                                        "8px 12px 4px",

                                                                    background:

                                                                        "linear-gradient(to top, rgba(0,0,0,.75), transparent)",

                                                                    color: "#fff"

                                                                }}

                                                            >

                                                                <Text

                                                                    ellipsis

                                                                    style={{
                                                                        color: "#fff"
                                                                    }}

                                                                    strong

                                                                >

                                                                    {item.alt}

                                                                </Text>

                                                            </div>

                                                        </div>

                                                    </Card>

                                                )}
                                            </DraggableMediaCard>
                                        </Col>

                                    )
                                })

                            }

                        </Row>

                    </div>

                    {/* MODALS */}

                    <CreateFolderModal
                        open={folderModalOpen}
                        onCancel={() => {
                            setFolderModalOpen(false);
                        }}
                        onSubmit={handleCreateFolder}
                    />

                    <RenameFolderModal
                        open={renameModalOpen}
                        folder={editingFolder}
                        onCancel={() => {
                            setRenameModalOpen(false);
                        }}
                        onSubmit={handleRenameFolder}
                    />

                    <EditMediaModal
                        open={mediaModalOpen}
                        media={editingMedia}
                        onCancel={() => {
                            setMediaModalOpen(false);
                        }}
                        onSubmit={handleUpdateMedia}
                    />

                    {/* PREVIEW */}

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
                                padding: 50
                            }}

                        />

                    </Modal>

                </div>

                <Modal

                    open={moveModalOpen}

                    title="Move Media"

                    onCancel={() => {

                        setMoveModalOpen(
                            false
                        );

                    }}

                    footer={null}

                >

                    <Space
                        direction="vertical"
                        style={{
                            width: "100%"
                        }}
                    >

                        {

                            folders.map(folder => (

                                <Button

                                    key={folder.id}

                                    block

                                    onClick={async () => {

                                        try {

                                            await moveMedia({

                                                media_ids:
                                                    selectedMediaIds,

                                                folder_id:
                                                    folder.id

                                            });

                                            message.success(
                                                "Media moved"
                                            );

                                            setMoveModalOpen(
                                                false
                                            );

                                            setSelectedMediaIds([]);

                                            setMedia(prev =>

                                                prev.filter(item =>

                                                (

                                                    selectedMediaIds.includes(
                                                        mediaId
                                                    )

                                                        ? !selectedMediaIds.includes(
                                                            item.id
                                                        )

                                                        : item.id !== mediaId

                                                )

                                                )

                                            );
                                            setSelectedMediaIds([]);
                                        } catch (error) {

                                            console.error(error);

                                            message.error(
                                                "Move failed"
                                            );

                                        }

                                    }}

                                >

                                    {folder.name}

                                </Button>

                            ))

                        }

                    </Space>

                </Modal>

            </>
        </DndContext>
    );


}
