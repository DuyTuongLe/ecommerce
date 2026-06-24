import { createContext, useContext, useState } from "react";

const PageContext = createContext();

export function PageProvider({ children }) {
    const [alternateSlugs, setAlternateSlugs] = useState({});

    return (
        <PageContext.Provider value={{ alternateSlugs, setAlternateSlugs }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePageContext() {
    return useContext(PageContext);
}
