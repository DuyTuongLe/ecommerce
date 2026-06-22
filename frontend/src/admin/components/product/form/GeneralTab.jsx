// src/admin/components/product/form/GeneralTab.jsx

import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    Checkbox,
    TreeSelect,
    DatePicker
} from "antd";

export default function GeneralTab({

    lang,

    brands = [],

    categories = [],

    attributes = []

}) {

    return (

        <Row gutter={24}>

            {/* LEFT */}

            <Col span={16}>

                <Card title="Content">

                    <Form.Item
                        label="Product Name"
                        name={[
                            "translations",
                            lang,
                            "name"
                        ]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter product name"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item

                        label="Slug"

                        name={[

                            "slugs",

                            lang

                        ]}

                    >

                        <Input />

                    </Form.Item>

                    <Form.Item
                        label="Short Description"
                        name={[
                            "translations",
                            lang,
                            "short_description"
                        ]}
                    >

                        <Input.TextArea
                            rows={4}
                        />

                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name={[
                            "translations",
                            lang,
                            "content"
                        ]}
                    >

                        <Input.TextArea
                            rows={14}
                        />

                    </Form.Item>

                </Card>

            </Col>

            {/* RIGHT */}

            <Col span={8}>

                <Card

                    title="Information"

                    style={{
                        marginBottom: 16
                    }}

                >

                    <Form.Item
                        label="SKU"
                        name="sku"
                        rules={[
                            {
                                required: true,
                                message: "Please enter SKU"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Barcode"
                        name="barcode"
                    >

                        <Input />

                    </Form.Item>

                    <Form.Item
                        label="Brand"
                        name="brand_id"
                    >

                        <Select
                            options={brands}
                        />

                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category_ids"
                    >

                        <TreeSelect

                            treeCheckable

                            treeData={categories}

                            treeDefaultExpandAll

                        />

                    </Form.Item>

                    <Form.Item
                        label="Product Type"
                        name="product_type"
                    >

                        <Select

                            options={[

                                {
                                    value: "simple",
                                    label: "Simple"
                                }

                            ]}

                        />

                    </Form.Item>

                    <Form.Item
                        label="Published At"
                        name="published_at"
                    >

                        <DatePicker

                            showTime

                            style={{
                                width: "100%"
                            }}

                        />

                    </Form.Item>

                </Card>

                {/* Attributes */}

                <Card

                    title="Attributes"

                    style={{
                        marginBottom: 16
                    }}

                >

                    {

                        attributes.map(

                            attribute => (

                                <Form.Item

                                    key={
                                        attribute.id
                                    }

                                    label={
                                        attribute.name
                                    }

                                    name={[

                                        "attributes",

                                        attribute.code

                                    ]}

                                >

                                    <Select

                                        options={
                                            attribute.options
                                        }

                                    />

                                </Form.Item>

                            )

                        )

                    }

                </Card>

                {/* Status */}

                <Card title="Status">

                    <Form.Item
                        name="status"
                        valuePropName="checked"
                    >

                        <Checkbox>

                            Published

                        </Checkbox>

                    </Form.Item>

                    <Form.Item
                        name="featured"
                        valuePropName="checked"
                    >

                        <Checkbox>

                            Featured

                        </Checkbox>

                    </Form.Item>

                    <Form.Item
                        name="is_new"
                        valuePropName="checked"
                    >

                        <Checkbox>

                            New Product

                        </Checkbox>

                    </Form.Item>

                </Card>

            </Col>

        </Row>

    );

}