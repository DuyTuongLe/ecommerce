// src/admin/pages/MediaManager.jsx

import MediaExplorer
    from "../components/media/MediaExplorer";

export default function MediaManager() {

    return (

        <div
            style={{
                padding: 20,
                height: "100%"
            }}
        >

            <MediaExplorer
                mode="manager"
            />

        </div>

    );

}