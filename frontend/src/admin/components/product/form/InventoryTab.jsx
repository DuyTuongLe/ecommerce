import {
    Card,
    Form,
    Checkbox,
    InputNumber,
    Select
} from "antd";

export default function InventoryTab() {

    return (

        <Card title="Inventory">

            <Form.Item
                name="manage_stock"
                valuePropName="checked"
            >

                <Checkbox>
                    Manage Stock
                </Checkbox>

            </Form.Item>

            <Form.Item
                label="Quantity"
                name="stock"
            >

                <InputNumber
                    style={{
                        width: "100%"
                    }}
                />

            </Form.Item>

            <Form.Item
                label="Stock Status"
                name="stock_status"
            >

                <Select

                    options={[

                        {
                            label: "In Stock",
                            value: "in_stock"
                        },

                        {
                            label: "Out Of Stock",
                            value: "out_of_stock"
                        }

                    ]}

                />

            </Form.Item>

        </Card>

    );

}