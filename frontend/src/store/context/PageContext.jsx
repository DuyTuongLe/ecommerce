import { createContext, useContext, useState } from "react";

const PageContext = createContext();

export function PageProvider({ children }) {
    const [alternateSlugs, setAlternateSlugs] = useState({});
    const [breadcrumbs, setBreadcrumbs] = useState(null);

    return (
        <PageContext.Provider value={{ alternateSlugs, setAlternateSlugs, breadcrumbs, setBreadcrumbs }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePageContext() {
    return useContext(PageContext);
}
