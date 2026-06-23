import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    Input, Select, Button, Space, Card, Row, Col,
    Checkbox, InputNumber, Spin, message, Image, DatePicker,
    Divider,
} from "antd";
import dayjs from "dayjs";
import slugify from "slugify";

import GridEditor from "../components/noiDung/GridEditor";
import MediaPickerModal from "../components/media/MediaPickerModal";
import useNoiDung from "../hooks/useNoiDung";
import { useLanguages } from "../hooks/useLanguages";
import { getNoiDungPages } from "../../shared/services/noiDungApi";

const TYPE_OPTIONS = [
    { value: "section", label: "Section" },
    { value: "news", label: "News" },
    { value: "blog", label: "Blog" },
];

const DEFAULT_JSON = {
    version: 1,
    rows: [{
        columns: [{
            span: { desktop: 12, laptop: 12, tablet: 12, mobile: 12 },
            content: "",
        }],
    }],
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
    const [thumbnailId, setThumbnailId] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [pages, setPages] = useState([]);
    const [allTranslations, setAllTranslations] = useState({});
    const [allSlugs, setAllSlugs] = useState({});
    const [createdAt, setCreatedAt] = useState(null);

    useEffect(() => {
        getNoiDungPages(lang).then(setPages);
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
            thutu,
            trangthai: trangthai ? 1 : 0,
            tieu_de: tieu_de,
            slug: slug,
            noi_dung_json: gridData,
            seo_title: seoTitle,
            seo_description: seoDescription,
            seo_keywords: seoKeywords,
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
                            <Input
                                value={tieu_de}
                                onChange={(e) => setTieuDe(e.target.value)}
                                onBlur={() => { if (!slug) generateSlug(); }}
                                placeholder="Enter title..."
                                size="large"
                                style={{ fontSize: 20, fontWeight: 600, borderRadius: 8 }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={12} style={{ marginBottom: 20 }}>
                        <Col flex="1">
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
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

                    {/* Grid Editor */}
                    <div style={{ marginBottom: 24 }}>
                        <GridEditor value={gridData} onChange={setGridData} />
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
                                        onChange={setType}
                                        options={TYPE_OPTIONS}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {type === "section" && (
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
                                <Button block onClick={() => setMediaModalOpen(true)}>
                                    Select Thumbnail
                                </Button>
                            </Card>
                        </Col>

                        {(type === "news" || type === "blog") && (
                            <Col span={8}>
                                <Card title="SEO" size="small" style={{ borderRadius: 10 }}>
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>SEO Title</label>
                                        <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                                    </div>
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>SEO Description</label>
                                        <Input.TextArea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#666" }}>SEO Keywords</label>
                                        <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
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
