//src/admin/components/media/DroppableFolderCard.jsx


import {

    useDroppable,

    useDraggable

} from "@dnd-kit/core";

export default function DroppableFolderCard({

    id,

    children

}) {

    /*
    |--------------------------------------------------------------------------
    | DROPPABLE
    |--------------------------------------------------------------------------
    */

    const {

        isOver,

        setNodeRef:
            setDroppableNodeRef

    } = useDroppable({

        id: `folder-${id}`

    });

    /*
    |--------------------------------------------------------------------------
    | DRAGGABLE
    |--------------------------------------------------------------------------
    */

    const {

        attributes,

        listeners,

        setNodeRef:
            setDraggableNodeRef,

    } = useDraggable({

        id: `folder-drag-${id}`

    });

    return (

        <div

            ref={setDroppableNodeRef}

            style={{

                border:

                    isOver

                        ? "2px solid #1677ff"

                        : undefined,

                borderRadius: 12

            }}

        >

            <div

                ref={setDraggableNodeRef}

                {...listeners}

                {...attributes}

            >

                {children}

            </div>

        </div>

    );

}