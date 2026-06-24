import { createContext, useContext, useState, useEffect } from "react";
import { getMe, login as loginApi, logout as logoutApi } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe()
            .then((res) => setUser(res.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const res = await loginApi(email, password);
        setUser(res.user);
        return res;
    }

    async function logout() {
        await logoutApi();
        setUser(null);
    }

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
}
