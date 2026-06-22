// src/admin/components/product/ProductForm.jsx

import {

    Form,
    Tabs,
    Button,
    Space,
    Select,
    message,
    Spin

} from "antd";

import {
    useState,
    useEffect
} from "react";

import {
    useNavigate
} from "react-router-dom";

import GeneralTab
    from "./form/GeneralTab";

import ImagesTab
    from "./form/ImagesTab";

import PricingTab
    from "./form/PricingTab";

import InventoryTab
    from "./form/InventoryTab";

import SeoTab
    from "./form/SeoTab";

import useProductForm
    from "../../hooks/useProductForm";

import useProductOptions
    from "../../hooks/useProductOptions";

import dayjs from "dayjs";

export default function ProductForm({

    mode = "create",

    productId,

    lang = "vi",

    languages = []

}) {

    const [form] = Form.useForm();

    const {

        product,

        loading,

        saveProduct

    } = useProductForm({

        productId

    });

    const [

        activeTab,

        setActiveTab

    ] = useState(
        "general"
    );

    const [

        activeLocale,

        setActiveLocale

    ] = useState(
        lang
    );

    const options =
        useProductOptions(
            activeLocale
        );

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(
            `/admin/products?lang=${lang}`
        );
    };

    const handleSubmit = async (
        closeAfterSave = false
    ) => {

        try {

            await form.validateFields();

            const values = form.getFieldsValue(true);

            const payload = {

                ...values,

                published_at:

                    values.published_at?.format

                        ? values.published_at.format(
                            "YYYY-MM-DD HH:mm:ss"
                        )

                        : values.published_at

            };

            const result = await saveProduct(
                payload
            );

            message.success(
                result.message
                || "Product saved successfully"
            );

            // CREATE

            if (!productId) {

                navigate(
                    `/admin/products/${result.id}/edit?lang=${lang}`
                );

                return;

            }

            // UPDATE

            if (closeAfterSave) {

                navigate(
                    `/admin/products?lang=${lang}`
                );

            }

        }
        catch (error) {

            if (error.errorFields) {

                setActiveTab("general");

                message.error(
                    "Vui lòng nhập đầy đủ các trường bắt buộc"
                );

                return;
            }

            message.error("Save failed");

        }


    };

    useEffect(() => {

        setActiveLocale(
            lang
        );

    }, [lang]);

    useEffect(() => {

        if (!product) {
            return;
        }

        form.setFieldsValue({

            ...product,

            thumbnail_id:
                product.thumbnail?.id || null,

            gallery_ids:
                product.gallery?.map(
                    item => item.id
                ) || [],

            published_at:
                product.published_at
                    ? dayjs(product.published_at)
                    : null

        });


    }, [

        product,

        form

    ]);

    return (
        <Spin spinning={loading}>
            <Form

                form={form}

                layout="vertical"

                onFinish={handleSubmit}

                style={{
                    height: "100%"
                }}

            >

                <div

                    style={{

                        height: "100%",

                        display: "flex",

                        flexDirection:
                            "column"

                    }}

                >

                    {/* Header */}

                    <div

                        style={{

                            padding:
                                "24px 24px 0",

                            flexShrink: 0

                        }}

                    >

                        <div

                            style={{

                                display: "flex",

                                justifyContent:
                                    "space-between",

                                alignItems:
                                    "center",

                                marginBottom: 16

                            }}

                        >

                            <h2
                                style={{
                                    margin: 0
                                }}
                            >

                            </h2>

                            <Space>

                                <Select

                                    value={
                                        activeLocale
                                    }

                                    onChange={
                                        setActiveLocale
                                    }

                                    style={{
                                        width: 140
                                    }}

                                    options={

                                        languages.map(
                                            item => ({

                                                label:
                                                    item.name,

                                                value:
                                                    item.code

                                            })
                                        )

                                    }

                                />

                                <Button
                                    onClick={handleCancel}
                                >

                                    Cancel

                                </Button>

                                <Button
                                    onClick={() =>
                                        handleSubmit(false)
                                    }
                                >
                                    Save
                                </Button>

                                <Button
                                    type="primary"
                                    onClick={() =>
                                        handleSubmit(true)
                                    }
                                >
                                    Save & Close
                                </Button>

                            </Space>

                        </div>

                        <Tabs

                            activeKey={
                                activeTab
                            }

                            onChange={
                                setActiveTab
                            }

                            items={[

                                {
                                    key:
                                        "general",

                                    label:
                                        "General"
                                },

                                {
                                    key:
                                        "images",

                                    label:
                                        "Images"
                                },

                                {
                                    key:
                                        "pricing",

                                    label:
                                        "Pricing"
                                },

                                {
                                    key:
                                        "inventory",

                                    label:
                                        "Inventory"
                                },

                                {
                                    key:
                                        "seo",

                                    label:
                                        "SEO"
                                }

                            ]}

                        />

                    </div>

                    {/* Content */}

                    <div

                        style={{

                            flex: 1,

                            minHeight: 0,

                            overflowY:
                                "auto",

                            padding:
                                "0 24px 24px"

                        }}

                    >

                        {

                            activeTab ===
                            "general" &&

                            <GeneralTab

                                lang={activeLocale}

                                brands={
                                    options.brands
                                }

                                categories={
                                    options.categories
                                }

                                attributes={
                                    options.attributes
                                }

                            />

                        }

                        {

                            activeTab ===
                            "images" &&

                            <ImagesTab
                                product={product}

                                form={form}
                            />

                        }

                        {

                            activeTab ===
                            "pricing" &&

                            <PricingTab />

                        }

                        {

                            activeTab ===
                            "inventory" &&

                            <InventoryTab />

                        }

                        {

                            activeTab ===
                            "seo" &&

                            <SeoTab
                                lang={activeLocale}
                            />

                        }

                    </div>

                </div>

            </Form>
        </Spin>
    );

}