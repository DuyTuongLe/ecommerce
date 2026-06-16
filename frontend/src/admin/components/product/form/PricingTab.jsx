import {
    Card,
    Form,
    InputNumber
} from "antd";

export default function PricingTab() {

    return (

        <Card title="Pricing">

            <Form.Item
                label="Price"
                name="price"
            >

                <InputNumber
                    style={{
                        width: "100%"
                    }}
                />

            </Form.Item>

            <Form.Item
                label="Sale Price"
                name="sale_price"
            >

                <InputNumber
                    style={{
                        width: "100%"
                    }}
                />

            </Form.Item>

            <Form.Item
                label="Cost Price"
                name="cost_price"
            >

                <InputNumber
                    style={{
                        width: "100%"
                    }}
                />

            </Form.Item>

        </Card>

    );

}