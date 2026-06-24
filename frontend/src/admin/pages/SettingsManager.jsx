import { useEffect, useState } from "react";
import { Input, Button, Card, Row, Col, message, Spin, Image } from "antd";
import { SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../shared/services/api";
import MediaPickerModal from "../components/media/MediaPickerModal";

const backendURL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000";

export default function SettingsManager() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mediaTarget, setMediaTarget] = useState(null);
    const [mediaOpen, setMediaOpen] = useState(false);

    async function fetchSettings() {
        setLoading(true);
        try {
            const { data } = await api.get("/settings");
            setSettings(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchSettings(); }, []);

    function handleChange(key, value) {
        setSettings((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSave() {
        setSaving(true);
        try {
            const { css_variables, ...rest } = settings;
            await api.post("/settings", { settings: rest });
            message.success("Lưu thành công");
        } catch {
            message.error("Lỗi khi lưu");
        } finally {
            setSaving(false);
        }
    }

    function openMediaFor(key) {
        setMediaTarget(key);
        setMediaOpen(true);
    }

    function handleMediaSelect(media) {
        if (mediaTarget) {
            handleChange(mediaTarget, String(media.id));
            handleChange(mediaTarget + "_url", media.url);
        }
        setMediaOpen(false);
        setMediaTarget(null);
    }

    function clearMedia(key) {
        handleChange(key, "");
        handleChange(key + "_url", null);
    }

    const fieldStyle = { marginBottom: 16 };
    const labelStyle = { display: "block", marginBottom: 4, fontSize: 13, fontWeight: 500, color: "#555" };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-border-light)",
                background: "var(--color-bg-card)",
                display: "flex", gap: 8, alignItems: "center",
            }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>Cấu hình Website</h2>
                <span style={{ flex: 1 }} />
                <Button icon={<ReloadOutlined />} onClick={fetchSettings}>Reload</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>Lưu</Button>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
                <Spin spinning={loading}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Card title="Thông tin chung" size="small" style={{ marginBottom: 20 }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Tên website</label>
                                    <Input value={settings.site_name || ""} onChange={(e) => handleChange("site_name", e.target.value)} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Footer text</label>
                                    <Input value={settings.footer_text || ""} onChange={(e) => handleChange("footer_text", e.target.value)} />
                                </div>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Logo</label>
                                            {settings.logo_id_url && (
                                                <div style={{ marginBottom: 8 }}>
                                                    <img src={settings.logo_id_url} alt="Logo" style={{ maxHeight: 60, maxWidth: "100%", objectFit: "contain", background: "#f5f5f5", borderRadius: 4, padding: 4 }} />
                                                </div>
                                            )}
                                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                <Button size="small" onClick={() => openMediaFor("logo_id")}>Chọn ảnh</Button>
                                                {settings.logo_id && <Button size="small" danger onClick={() => clearMedia("logo_id")}>Xóa</Button>}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Favicon</label>
                                            {settings.favicon_id_url && (
                                                <div style={{ marginBottom: 8 }}>
                                                    <img src={settings.favicon_id_url} alt="Favicon" style={{ maxHeight: 40, maxWidth: 40, objectFit: "contain", background: "#f5f5f5", borderRadius: 4, padding: 4 }} />
                                                </div>
                                            )}
                                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                <Button size="small" onClick={() => openMediaFor("favicon_id")}>Chọn ảnh</Button>
                                                {settings.favicon_id && <Button size="small" danger onClick={() => clearMedia("favicon_id")}>Xóa</Button>}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Liên hệ" size="small" style={{ marginBottom: 20 }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Email</label>
                                    <Input value={settings.contact_email || ""} onChange={(e) => handleChange("contact_email", e.target.value)} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Số điện thoại</label>
                                    <Input value={settings.contact_phone || ""} onChange={(e) => handleChange("contact_phone", e.target.value)} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Địa chỉ</label>
                                    <Input value={settings.contact_address || ""} onChange={(e) => handleChange("contact_address", e.target.value)} />
                                </div>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Mạng xã hội" size="small">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Facebook URL</label>
                                    <Input value={settings.facebook_url || ""} onChange={(e) => handleChange("facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Instagram URL</label>
                                    <Input value={settings.instagram_url || ""} onChange={(e) => handleChange("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>YouTube URL</label>
                                    <Input value={settings.youtube_url || ""} onChange={(e) => handleChange("youtube_url", e.target.value)} placeholder="https://youtube.com/..." />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            </div>

            <MediaPickerModal
                open={mediaOpen}
                onCancel={() => { setMediaOpen(false); setMediaTarget(null); }}
                onSelect={handleMediaSelect}
            />
        </div>
    );
}
