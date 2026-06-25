import { useState, memo } from "react";
import {
    Card, Button, Input, InputNumber, Switch,
    Space, Tooltip, Row, Col,
} from "antd";
import {
    PlusOutlined, DeleteOutlined, ArrowUpOutlined,
    ArrowDownOutlined, PictureOutlined,
} from "@ant-design/icons";
import MediaPickerModal from "../../components/media/MediaPickerModal";

const DEFAULT_SETTINGS = {
    autoplay: true,
    delay: 0,
    loop: true,
    slidesPerView: 1,
    showNav: true,
    showDots: true,
    speed: 600,
};

function SlideEditor({ value, onChange }) {
    const data = value || { version: 1, settings: DEFAULT_SETTINGS, slides: [] };
    const settings = { ...DEFAULT_SETTINGS, ...data.settings };
    const slides = data.slides || [];

    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(null);

    function updateData(changes) {
        onChange({ ...data, ...changes });
    }

    function updateSettings(key, val) {
        updateData({ settings: { ...settings, [key]: val } });
    }

    function updateSlide(index, changes) {
        const next = slides.map((s, i) => (i === index ? { ...s, ...changes } : s));
        updateData({ slides: next });
    }

    function addSlide() {
        updateData({
            slides: [...slides, { media_id: null, image: "", title: "", description: "", link: "", button_text: "" }],
        });
    }

    function removeSlide(index) {
        updateData({ slides: slides.filter((_, i) => i !== index) });
    }

    function moveSlide(index, dir) {
        const newIndex = index + dir;
        if (newIndex < 0 || newIndex >= slides.length) return;
        const next = [...slides];
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        updateData({ slides: next });
    }

    function handleSelectMedia(media) {
        if (activeSlideIndex !== null) {
            updateSlide(activeSlideIndex, { media_id: media.id, image: media.url });
        }
        setMediaModalOpen(false);
        setActiveSlideIndex(null);
    }

    return (
        <div>
            <Card title="Slide Settings" size="small" style={{ marginBottom: 16, borderRadius: 10 }}>
                <Row gutter={16}>
                    <Col span={4}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Slides/View</label>
                            <InputNumber value={settings.slidesPerView} onChange={(v) => updateSettings("slidesPerView", v)} min={1} max={6} style={{ width: "100%" }} size="small" />
                        </div>
                    </Col>
                    <Col span={4}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Delay (ms)</label>
                            <InputNumber value={settings.delay} onChange={(v) => updateSettings("delay", v)} min={0} step={500} style={{ width: "100%" }} size="small" />
                            <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>0 = chạy liên tục</div>
                        </div>
                    </Col>
                    <Col span={4}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Speed (ms)</label>
                            <InputNumber value={settings.speed} onChange={(v) => updateSettings("speed", v)} min={100} step={100} style={{ width: "100%" }} size="small" />
                        </div>
                    </Col>
                    <Col span={3}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Autoplay</label>
                            <Switch checked={settings.autoplay} onChange={(v) => updateSettings("autoplay", v)} size="small" />
                        </div>
                    </Col>
                    <Col span={3}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Loop</label>
                            <Switch checked={settings.loop} onChange={(v) => updateSettings("loop", v)} size="small" />
                        </div>
                    </Col>
                    <Col span={3}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Nav</label>
                            <Switch checked={settings.showNav} onChange={(v) => updateSettings("showNav", v)} size="small" />
                        </div>
                    </Col>
                    <Col span={3}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Dots</label>
                            <Switch checked={settings.showDots} onChange={(v) => updateSettings("showDots", v)} size="small" />
                        </div>
                    </Col>
                </Row>
            </Card>

            {slides.map((slide, index) => (
                <Card
                    key={index}
                    size="small"
                    style={{ marginBottom: 12, borderRadius: 10 }}
                    title={<span style={{ fontWeight: 500 }}>Slide {index + 1}</span>}
                    extra={
                        <Space size={4}>
                            <Tooltip title="Move up"><Button size="small" type="text" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => moveSlide(index, -1)} /></Tooltip>
                            <Tooltip title="Move down"><Button size="small" type="text" icon={<ArrowDownOutlined />} disabled={index === slides.length - 1} onClick={() => moveSlide(index, 1)} /></Tooltip>
                            <Tooltip title="Delete"><Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeSlide(index)} /></Tooltip>
                        </Space>
                    }
                >
                    <Row gutter={16}>
                        <Col span={6}>
                            <div
                                onClick={() => { setActiveSlideIndex(index); setMediaModalOpen(true); }}
                                style={{
                                    width: "100%", height: 140, borderRadius: 8,
                                    border: "1px dashed #d9d9d9", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", overflow: "hidden", background: "#fafafa",
                                }}
                            >
                                {slide.image ? (
                                    <img src={slide.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ textAlign: "center", color: "#bbb" }}>
                                        <PictureOutlined style={{ fontSize: 28 }} />
                                        <div style={{ fontSize: 11, marginTop: 4 }}>Select Image</div>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col span={18}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <div style={{ marginBottom: 8 }}>
                                        <label style={{ fontSize: 12, color: "#666" }}>Title</label>
                                        <Input size="small" value={slide.title} onChange={(e) => updateSlide(index, { title: e.target.value })} placeholder="Slide title" />
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{ marginBottom: 8 }}>
                                        <label style={{ fontSize: 12, color: "#666" }}>Button Text</label>
                                        <Input size="small" value={slide.button_text} onChange={(e) => updateSlide(index, { button_text: e.target.value })} placeholder="e.g. Shop Now" />
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div style={{ marginBottom: 8 }}>
                                        <label style={{ fontSize: 12, color: "#666" }}>Description</label>
                                        <Input.TextArea size="small" rows={2} value={slide.description} onChange={(e) => updateSlide(index, { description: e.target.value })} placeholder="Short description" />
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div>
                                        <label style={{ fontSize: 12, color: "#666" }}>Link URL</label>
                                        <Input size="small" value={slide.link} onChange={(e) => updateSlide(index, { link: e.target.value })} placeholder="/products or https://..." />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            ))}

            <Button type="dashed" block icon={<PlusOutlined />} onClick={addSlide} style={{ marginTop: 8 }}>
                Add Slide
            </Button>

            <MediaPickerModal
                open={mediaModalOpen}
                onCancel={() => { setMediaModalOpen(false); setActiveSlideIndex(null); }}
                onSelect={handleSelectMedia}
            />
        </div>
    );
}

export default memo(SlideEditor);
