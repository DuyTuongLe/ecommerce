// src/admin/components/product/ProductForm.jsx

import {

    Form,
    Tabs,
    Button,
    Space

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

export default function ProductForm({

    mode = "create",

    productId,

    lang = "vi"

}) {

    const [form] = Form.useForm();

    const {

        product,

        options,

        loading

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

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(
            `/admin/products?lang=${lang}`
        );
    };

    const handleSubmit = async () => {

    const values =
        form.getFieldsValue(true);

    console.log(values);

};

    useEffect(() => {

        if (
            !product
        ) return;

        const translation =

            product
                .translations?.[
            lang
            ]

            ||

            {};

        form.setFieldsValue({

            sku:
                product.sku,

            barcode:
                product.barcode,

            brand_id:
                product.brand_id,

            categories:
                product.category_ids,

            product_type:
                product.product_type,

            status:
                !!product.status,

            featured:
                !!product.featured,

            is_new:
                !!product.is_new,

            price:
                product.price,

            sale_price:
                product.sale_price,

            cost_price:
                product.cost_price,

            stock:
                product.stock,

            manage_stock:
                !!product.manage_stock,

            stock_status:
                product.stock_status,

            name:
                translation.name,

            short_description:
                translation.short_description,

            content:
                translation.content,

            seo_title:
                translation.seo_title,

            seo_description:
                translation.seo_description,

            seo_keywords:
                translation.seo_keywords,

            attributes:
                product.attributes

        });

    }, [

        product,

        lang,

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

                            {

                                mode ===
                                    "edit"

                                    ? "Edit Product"

                                    : "Create Product"

                            }

                        </h2>

                        <Space>

                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>

                            <Button
                                onClick={() => form.submit()}
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

                        <SeoTab />

                    }

                </div>

            </div>

        </Form>

    );

}