import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    Input, Select, Button, Space, Card, Row, Col,
    Checkbox, InputNumber, Spin, message, Image, DatePicker,
    Divider, ColorPicker, Switch,
} from "antd";
import dayjs from "dayjs";
import slugify from "slugify";

import GridEditor from "../components/noiDung/GridEditor";
import SlideEditor from "../components/noiDung/SlideEditor";
import MediaPickerModal from "../components/media/MediaPickerModal";
import useNoiDung from "../hooks/useNoiDung";
import { useLanguages } from "../hooks/useLanguages";
import { getNoiDungPages, getBlogCategories } from "../../shared/services/noiDungApi";

const TYPE_OPTIONS = [
    { value: "section", label: "Section" },
    { value: "slide", label: "Slide" },
    { value: "blog", label: "Blog" },
];

function DebouncedInput({ value, onChange, textarea, ...props }) {
    const [local, setLocal] = useState(value);
    useEffect(() => { setLocal(value); }, [value]);
    const Comp = textarea ? Input.TextArea : Input;
    return (
        <Comp
            {...props}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={() => onChange(local)}
        />
    );
}

const DEFAULT_JSON = {
    version: 1,
    rows: [{
        columns: [{
            span: { desktop: 12, laptop: 12, tablet: 12, mobile: 12 },
            content: "",
        }],
    }],
};

const DEFAULT_SLIDE_JSON = {
    version: 1,
    settings: { autoplay: true, delay: 3000, loop: true, effect: "slide", slidesPerView: 1 },
    slides: [],
};

export default function NoiDungEditor() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const languages = useLanguages();
    const { fetchOne, create, update, loading } = useNoiDung();

    const isEdit = !!id;
    const [lang, setLang] = useState(searchParams.get("lang") || "vi");
    const [type, setType] = useState("section");
    const [danduongId, setDanduongId] = useState(null);
    const [thutu, setThutu] = useState(0);
    const [trangthai, setTrangthai] = useState(true);
    const [tieu_de, setTieuDe] = useState("");
    const [slug, setSlug] = useState("");
    const [gridData, setGridData] = useState(DEFAULT_JSON);
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");
    const [custom, setCustom] = useState("");
    const [thumbnailId, setThumbnailId] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [pages, setPages] = useState([]);
    const [blogCats, setBlogCats] = useState([]);
    const [allTranslations, setAllTranslations] = useState({});
    const [allSlugs, setAllSlugs] = useState({});
    const [createdAt, setCreatedAt] = useState(null);
    const [imageSettings, setImageSettings] = useState({});

    useEffect(() => {
        getNoiDungPages(lang).then(setPages);
        getBlogCategories(lang).then(setBlogCats);
    }, [lang]);

    useEffect(() => {
        if (!isEdit) return;
        fetchOne(id).then((data) => {
            if (!data) return;
            setType(data.type);
            setDanduongId(data.danduong_id);
            setThutu(data.thutu);
            setTrangthai(!!data.trangthai);
            setThumbnailId(data.thumbnail_id);
            setThumbnailPreview(data.thumbnail);
            setAllTranslations(data.translations || {});
            setAllSlugs(data.slugs || {});
            setCreatedAt(data.created_at ? dayjs(data.created_at) : null);
            setImageSettings(data.image_settings || {});
            loadLang(data.translations, data.slugs, lang);
        });
    }, [id]);

    useEffect(() => {
        if (isEdit) {
            loadLang(allTranslations, allSlugs, lang);
        }
    }, [lang]);

    function loadLang(translations, slugs, code) {
        const t = translations?.[code];
        setTieuDe(t?.tieu_de || "");
        setGridData(t?.noi_dung_json || DEFAULT_JSON);
        setSeoTitle(t?.seo_title || "");
        setSeoDescription(t?.seo_description || "");
        setSeoKeywords(t?.seo_keywords || "");
        setCustom(t?.custom || "");
        setSlug(slugs?.[code] || "");
    }

    function saveLangToCache() {
        setAllTranslations((prev) => ({
            ...prev,
            [lang]: {
                tieu_de: tieu_de,
                noi_dung_json: gridData,
                seo_title: seoTitle,
                seo_description: seoDescription,
                seo_keywords: seoKeywords,
                custom: custom,
            },
        }));
        setAllSlugs((prev) => ({ ...prev, [lang]: slug }));
    }

    function handleLangChange(newLang) {
        saveLangToCache();
        setLang(newLang);
    }

    function generateSlug() {
        setSlug(slugify(tieu_de, { lower: true, strict: true, locale: "vi" }));
    }

    async function handleSave(closeAfterSave = false) {
        const payload = {
            lang,
            danduong_id: danduongId,
            type,
            thumbnail_id: thumbnailId,
            image_settings: imageSettings,
            thutu: isEdit ? thutu : (thutu || undefined),
            trangthai: trangthai ? 1 : 0,
            tieu_de: tieu_de,
            slug: slug,
            noi_dung_json: gridData,
            seo_title: seoTitle,
            seo_description: seoDescription,
            seo_keywords: seoKeywords,
            custom: custom,
            created_at: createdAt?.format("YYYY-MM-DD HH:mm:ss") || null,
        };

        let result;
        if (isEdit) {
            result = await update(id, payload);
        } else {
            result = await create(payload);
        }

        if (result?.success || result?.id) {
            message.success("Saved successfully");
            if (!isEdit && result.id) {
                navigate(`/admin/noi-dung/${result.id}/edit?lang=${lang}`);
                return;
            }
            if (closeAfterSave) {
                navigate(`/admin/noi-dung?lang=${lang}`);
            }
        }
    }

    return (
        <Spin spinning={loading}>
            <div style={{ overflowY: "auto", height: "100vh", background: "var(--color-bg)" }}>
                {/* Sticky Header */}
                <div
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                        background: "var(--color-bg-card)",
                        padding: "12px 24px",
                        borderBottom: "1px solid var(--color-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "var(--shadow-sm)",
                    }}
                >
                    <Space>
                        <h2 style={{ margin: 0, fontSize: 18 }}>
                            {isEdit ? "Edit Content" : "Create Content"}
                        </h2>
                        {isEdit && (
                            <span style={{ color: "#999", fontSize: 13 }}>ID: {id}</span>
                        )}
                    </Space>
                    <Space>
                        <Select
                            value={lang}
                            onChange={handleLangChange}
                            style={{ width: 140 }}
                            options={languages.map((item) => ({
                                label: item.name,
                                value: item.code,
                            }))}
                        />
                        <Button onClick={() => navigate(`/admin/noi-dung?lang=${lang}`)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleSave(false)}>Save</Button>
                        <Button type="primary" onClick={() => handleSave(true)}>
                            Save & Close
                        </Button>
                    </Space>
                </div>

                <div style={{ padding: 24 }}>
                    {/* Title + Slug */}
                    <Row gutter={12} style={{ marginBottom: 20 }}>
                        <Col flex="1">
                            <DebouncedInput
                                value={tieu_de}
                                onChange={(val) => { setTieuDe(val); if (!slug) setSlug(slugify(val, { lower: true, strict: true, locale: "vi" })); }}
                                placeholder="Enter title..."
                                size="large"
                                style={{ fontSize: 20, fontWeight: 600, borderRadius: 8 }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={12} style={{ marginBottom: 20 }}>
                        <Col flex="1">
                            <DebouncedInput
                                value={slug}
                                onChange={setSlug}
                                placeholder="slug-url"
                                addonBefore="Slug"
                                addonAfter={
                                    <a onClick={generateSlug} style={{ cursor: "pointer" }}>
                                        Generate
                                    </a>
                                }
                            />
                        </Col>
                    </Row>

                    {/* Content Editor */}
                    <div style={{ marginBottom: 24 }}>
                        {type === "slide" ? (
                            <SlideEditor value={gridData} onChange={setGridData} />
                        ) : (
                            <GridEditor value={gridData} onChange={setGridData} />
                        )}
                    </div>

                    <Divider />

                    {/* Settings Row */}
                    <Row gutter={20}>
                        <Col span={8}>
                            <Card title="Settings" size="small" style={{ borderRadius: 10 }}>
                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Type</label>
                                    <Select
                                        value={type}
                                        onChange={(newType) => {
                                            setType(newType);
                                            if (newType === "slide" && gridData?.rows) {
                                                setGridData(DEFAULT_SLIDE_JSON);
                                            } else if (newType !== "slide" && gridData?.slides) {
                                                setGridData(DEFAULT_JSON);
                                            }
                                        }}
                                        options={TYPE_OPTIONS}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {(type === "section" || type === "slide") && (
                                    <div style={{ marginBottom: 12 }}>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Page</label>
                                        <Select
                                            value={danduongId}
                                            onChange={setDanduongId}
                                            options={pages}
                                            allowClear
                                            placeholder="Select page"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                )}

                                {type === "blog" && (
                                    <div style={{ marginBottom: 12 }}>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Danh mục Blog</label>
                                        <Select
                                            value={danduongId}
                                            onChange={setDanduongId}
                                            options={blogCats}
                                            allowClear
                                            placeholder="Chọn danh mục"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                )}

                                <Row gutter={12}>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Order</label>
                                            <InputNumber value={thutu} onChange={setThutu} style={{ width: "100%" }} />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Created At</label>
                                            <DatePicker showTime value={createdAt} onChange={setCreatedAt} style={{ width: "100%" }} />
                                        </div>
                                    </Col>
                                </Row>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Custom (biến tùy biến: footer, sidebar...)</label>
                                    <DebouncedInput
                                        value={custom}
                                        onChange={setCustom}
                                        placeholder="vd: footer, sidebar, banner..."
                                    />
                                </div>

                                <Checkbox checked={trangthai} onChange={(e) => setTrangthai(e.target.checked)}>
                                    Active
                                </Checkbox>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Thumbnail" size="small" style={{ borderRadius: 10 }}>
                                {thumbnailPreview ? (
                                    <div style={{ marginBottom: 10 }}>
                                        <Image width="100%" src={thumbnailPreview.url} style={{ borderRadius: 6 }} />
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            height: 120,
                                            background: "#f0f0f0",
                                            borderRadius: 6,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#bbb",
                                            marginBottom: 10,
                                        }}
                                    >
                                        No image selected
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button style={{ flex: 1 }} onClick={() => setMediaModalOpen(true)}>
                                        Select Thumbnail
                                    </Button>
                                    {thumbnailId && (
                                        <Button danger onClick={() => { setThumbnailId(null); setThumbnailPreview(null); setImageSettings({}); }}>
                                            Xóa
                                        </Button>
                                    )}
                                </div>

                                {thumbnailId && (
                                    <div style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
                                        <Checkbox
                                            checked={imageSettings.hide_in_detail || false}
                                            onChange={(e) => setImageSettings((s) => ({ ...s, hide_in_detail: e.target.checked }))}
                                        >
                                            Ẩn ảnh trong chi tiết
                                        </Checkbox>

                                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                                            <Select
                                                size="small"
                                                value={imageSettings.align || undefined}
                                                onChange={(v) => setImageSettings((s) => ({ ...s, align: v }))}
                                                placeholder="Align"
                                                allowClear
                                                style={{ width: 90 }}
                                                options={[
                                                    { value: "left", label: "Left" },
                                                    { value: "center", label: "Center" },
                                                    { value: "right", label: "Right" },
                                                ]}
                                            />
                                            <Select
                                                size="small"
                                                value={imageSettings.width || undefined}
                                                onChange={(v) => setImageSettings((s) => ({ ...s, width: v }))}
                                                placeholder="Width"
                                                allowClear
                                                style={{ width: 85 }}
                                                options={[
                                                    { value: "auto", label: "Auto" },
                                                    { value: "100", label: "100%" },
                                                    { value: "75", label: "75%" },
                                                    { value: "50", label: "50%" },
                                                    { value: "25", label: "25%" },
                                                ]}
                                            />
                                            <Select
                                                size="small"
                                                value={imageSettings.height || undefined}
                                                onChange={(v) => setImageSettings((s) => ({ ...s, height: v }))}
                                                placeholder="Height"
                                                allowClear
                                                style={{ width: 85 }}
                                                options={[
                                                    { value: "auto", label: "Auto" },
                                                    { value: "100", label: "100%" },
                                                    { value: "75", label: "75%" },
                                                    { value: "50", label: "50%" },
                                                    { value: "25", label: "25%" },
                                                ]}
                                            />
                                            <Select
                                                size="small"
                                                value={imageSettings.fit || undefined}
                                                onChange={(v) => setImageSettings((s) => ({ ...s, fit: v }))}
                                                placeholder="Fit"
                                                allowClear
                                                style={{ width: 100 }}
                                                options={[
                                                    { value: "cover", label: "Cover" },
                                                    { value: "contain", label: "Contain" },
                                                    { value: "fill", label: "Fill" },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Section Appearance" size="small" style={{ borderRadius: 10 }}>
                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Background Color</label>
                                    <Space>
                                        <ColorPicker
                                            value={gridData?.sectionSettings?.bgColor || ""}
                                            onChange={(_, hex) => setGridData((prev) => ({
                                                ...prev,
                                                sectionSettings: { ...prev?.sectionSettings, bgColor: hex, bgGradient: "" },
                                            }))}
                                        />
                                        <Input
                                            size="small"
                                            value={gridData?.sectionSettings?.bgColor || ""}
                                            onChange={(e) => setGridData((prev) => ({
                                                ...prev,
                                                sectionSettings: { ...prev?.sectionSettings, bgColor: e.target.value, bgGradient: "" },
                                            }))}
                                            placeholder="#ffffff"
                                            style={{ width: 120 }}
                                        />
                                        {gridData?.sectionSettings?.bgColor && (
                                            <Button size="small" type="text" danger onClick={() => setGridData((prev) => ({
                                                ...prev,
                                                sectionSettings: { ...prev?.sectionSettings, bgColor: "" },
                                            }))}>
                                                Clear
                                            </Button>
                                        )}
                                    </Space>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Background Gradient</label>
                                    <Input
                                        size="small"
                                        value={gridData?.sectionSettings?.bgGradient || ""}
                                        onChange={(e) => setGridData((prev) => ({
                                            ...prev,
                                            sectionSettings: { ...prev?.sectionSettings, bgGradient: e.target.value, bgColor: "" },
                                        }))}
                                        placeholder="linear-gradient(135deg, #667eea, #764ba2)"
                                    />
                                    {gridData?.sectionSettings?.bgGradient && (
                                        <div style={{
                                            height: 24, borderRadius: 4, marginTop: 6,
                                            background: gridData.sectionSettings.bgGradient,
                                        }} />
                                    )}
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Text Color</label>
                                    <Space>
                                        <ColorPicker
                                            value={gridData?.sectionSettings?.textColor || ""}
                                            onChange={(_, hex) => setGridData((prev) => ({
                                                ...prev,
                                                sectionSettings: { ...prev?.sectionSettings, textColor: hex },
                                            }))}
                                        />
                                        <Input
                                            size="small"
                                            value={gridData?.sectionSettings?.textColor || ""}
                                            onChange={(e) => setGridData((prev) => ({
                                                ...prev,
                                                sectionSettings: { ...prev?.sectionSettings, textColor: e.target.value },
                                            }))}
                                            placeholder="#000000"
                                            style={{ width: 120 }}
                                        />
                                    </Space>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>Custom Classes</label>
                                    <Input
                                        size="small"
                                        value={gridData?.sectionSettings?.classes || ""}
                                        onChange={(e) => setGridData((prev) => ({
                                            ...prev,
                                            sectionSettings: { ...prev?.sectionSettings, classes: e.target.value },
                                        }))}
                                        placeholder="py-16 my-4"
                                    />
                                </div>

                                <div>
                                    <Switch
                                        checked={gridData?.sectionSettings?.fullWidth || false}
                                        onChange={(checked) => setGridData((prev) => ({
                                            ...prev,
                                            sectionSettings: { ...prev?.sectionSettings, fullWidth: checked },
                                        }))}
                                        size="small"
                                    />
                                    <span style={{ marginLeft: 8, fontSize: 13 }}>Full Width (no max-width)</span>
                                </div>
                            </Card>
                        </Col>

                        {type === "blog" && (
                            <Col span={8}>
                                <Card title="SEO" size="small" style={{ borderRadius: 10 }}>
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>SEO Title</label>
                                        <DebouncedInput value={seoTitle} onChange={setSeoTitle} />
                                    </div>
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>SEO Description</label>
                                        <DebouncedInput textarea rows={3} value={seoDescription} onChange={setSeoDescription} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>SEO Keywords</label>
                                        <DebouncedInput value={seoKeywords} onChange={setSeoKeywords} />
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>
            </div>

            <MediaPickerModal
                open={mediaModalOpen}
                onCancel={() => setMediaModalOpen(false)}
                onSelect={(media) => {
                    setThumbnailId(media.id);
                    setThumbnailPreview({ id: media.id, url: media.url });
                    setMediaModalOpen(false);
                }}
            />
        </Spin>
    );
}
