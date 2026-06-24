import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../../shared/context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate("/admin/dashboard");
        } catch {
            message.error("Email hoặc mật khẩu không đúng");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{ background: "var(--color-bg)" }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm p-8 rounded-xl shadow-lg"
                style={{ background: "var(--color-bg-card)" }}
            >
                <div className="text-center mb-8">
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "var(--color-primary)" }}
                    >
                        Admin CMS
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                        Đăng nhập để quản trị
                    </p>
                </div>

                <div className="mb-4">
                    <Input
                        size="large"
                        prefix={<MailOutlined style={{ color: "var(--color-text-muted)" }} />}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                </div>

                <div className="mb-6">
                    <Input.Password
                        size="large"
                        prefix={<LockOutlined style={{ color: "var(--color-text-muted)" }} />}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                >
                    Đăng nhập
                </Button>
            </form>
        </div>
    );
}
