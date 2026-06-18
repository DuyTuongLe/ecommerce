// src/admin/components/product/ProductForm.jsx

import {

    Form,
    Tabs,
    Button,
    Space,
    Select

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

        options,

        loading,

        saveProduct

    } = useProductForm({

        productId,

        lang

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

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(
            `/admin/products?lang=${lang}`
        );
    };

    const handleSubmit = async () => {

        const values =
            form.getFieldsValue(true);

        const payload = {

            ...values,

            published_at:

                values.published_at

                    ? values.published_at.format(
                        "YYYY-MM-DD HH:mm:ss"
                    )

                    : null

        };

        console.log(payload);

        const result =
            await saveProduct(
                payload
            );

        console.log(result);

    };

    useEffect(() => {

        if (!product) {
            return;
        }

        form.setFieldsValue({

            ...product,

            published_at:
                product.published_at

                    ? dayjs(
                        product.published_at
                    )

                    : null

        });

    }, [

        product,

        form

    ]);

    return (

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
                                    form.submit()
                                }
                            >

                                Save

                            </Button>

                            <Button
                                type="primary"
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
                                options?.brands || []
                            }

                            categories={
                                options?.categories || []
                            }

                            attributes={
                                options?.attributes || []
                            }

                        />

                    }

                    {

                        activeTab ===
                        "images" &&

                        <ImagesTab />

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

    );

}