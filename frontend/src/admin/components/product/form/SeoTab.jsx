import {
    Card,
    Form,
    Input
} from "antd";

export default function SeoTab() {

    return (

        <Card title="SEO">

            <Form.Item
                label="SEO Title"
                name="seo_title"
            >

                <Input />

            </Form.Item>

            <Form.Item
                label="SEO Description"
                name="seo_description"
            >

                <Input.TextArea
                    rows={4}
                />

            </Form.Item>

            <Form.Item
                label="SEO Keywords"
                name="seo_keywords"
            >

                <Input />

            </Form.Item>

        </Card>

    );

}