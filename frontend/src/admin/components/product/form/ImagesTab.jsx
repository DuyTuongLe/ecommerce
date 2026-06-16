// src/admin/components/product/form/ImagesTab.jsx

import {

    Card,
    Row,
    Col,
    Button,
    Image,
    Space

} from "antd";

export default function ImagesTab() {

    return (

        <Row gutter={24}>

            <Col span={8}>

                <Card title="Thumbnail">

                    <Image

                        width="100%"

                        src="https://picsum.photos/400"

                    />

                    <br />
                    <br />

                    <Button
                        block
                    >
                        Select Thumbnail
                    </Button>

                </Card>

            </Col>

            <Col span={16}>

                <Card title="Gallery">

                    <Space wrap>

                        <Image
                            width={120}
                            src="https://picsum.photos/200?1"
                        />

                        <Image
                            width={120}
                            src="https://picsum.photos/200?2"
                        />

                        <Image
                            width={120}
                            src="https://picsum.photos/200?3"
                        />

                        <Image
                            width={120}
                            src="https://picsum.photos/200?4"
                        />

                    </Space>

                    <br />
                    <br />

                    <Button>
                        Add Images
                    </Button>

                </Card>

            </Col>

        </Row>

    );

}