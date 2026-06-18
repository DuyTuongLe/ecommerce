import {
    Card,
    Form,
    Input
} from "antd";

export default function SeoTab({
    lang
}) {

    return (

        <Card title="SEO">

            <Form.Item
                label="SEO Title"
                name={[
                    "translations",
                    lang,
                    "seo_title"
                ]}
            >

                <Input />

            </Form.Item>

            <Form.Item
                label="SEO Description"
                name={[
                    "translations",
                    lang,
                    "seo_description"
                ]}
            >

                <Input.TextArea
                    rows={4}
                />

            </Form.Item>

            <Form.Item
                label="SEO Keywords"
                name={[
                    "translations",
                    lang,
                    "seo_keywords"
                ]}
            >

                <Input />

            </Form.Item>

        </Card>

    );

}