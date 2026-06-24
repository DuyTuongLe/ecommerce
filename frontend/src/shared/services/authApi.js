import axios from "axios";
import api from "./api";

const backendURL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000";

export async function getCsrfCookie() {
    await axios.get(`${backendURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
    });
}

export async function login(email, password) {
    await getCsrfCookie();
    const { data } = await api.post("/auth/login", { email, password });
    return data;
}

export async function logout() {
    const { data } = await api.post("/auth/logout");
    return data;
}

export async function getMe() {
    const { data } = await api.get("/auth/me");
    return data;
}
