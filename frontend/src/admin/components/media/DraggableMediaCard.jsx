///src/admin/components/media/DraggableMediaCard.jsx



import {

    useDraggable

} from "@dnd-kit/core";

export default function DraggableMediaCard({

    id,

    children

}) {

    const {

        attributes,

        listeners,

        setNodeRef

    } = useDraggable({

        id: `media-${id}`,

        activationConstraint: {

            distance: 8

        }

    });

    return (

        <div

            ref={setNodeRef}
        >

            {children({

                listeners,

                attributes

            })}

        </div>

    );

}