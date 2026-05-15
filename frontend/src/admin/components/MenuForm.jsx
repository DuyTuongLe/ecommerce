// src/admin/components/MenuForm.jsx

import {

  Card,
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  Upload,
  Button,
  Divider

} from "antd";

import {

  UploadOutlined

} from "@ant-design/icons";

const {

  TextArea

} = Input;

export default function MenuForm() {

  return (

    <Card
      title="Add or Edit Menu"
    >

      <Form
        layout="vertical"
      >
        <Form.Item
          label="Menu Title"
        >

          <Input
            placeholder="Enter menu title"
          />

        </Form.Item>

        <Form.Item
          label="Description"
        >

          <TextArea
            rows={4}
            placeholder="Enter description"
          />

        </Form.Item>

        <Form.Item
          label="Language"
        >

          <Select

            options={[

              {
                label: "Tiếng Việt",
                value: "vi"
              },

              {
                label: "English",
                value: "en"
              }

            ]}

          />

        </Form.Item>

        <Form.Item
          label="Menu Type"
        >

          <Select

            options={[

              {
                label: "Page",
                value: "page"
              },

              {
                label: "Category",
                value: "category"
              },

              {
                label: "Custom Link",
                value: "link"
              }

            ]}

          />

        </Form.Item>

        <Form.Item
          label="Group"
        >

          <Select

            options={[

              {
                label: "Main Menu",
                value: 1
              },

              {
                label: "Footer Menu",
                value: 2
              }

            ]}

          />

        </Form.Item>

        <Form.Item
          label="Parent Item"
        >

          <Select

            options={[

              {
                label: "Home",
                value: 1
              },

              {
                label: "About",
                value: 2
              }

            ]}

          />

        </Form.Item>

        <Form.Item
          label="Publish"
          valuePropName="checked"
        >

          <Switch />

        </Form.Item>

        <Form.Item
          label="Target Window"
        >

          <Select

            options={[

              {
                label: "Same Window",
                value: "_self"
              },

              {
                label: "New Window",
                value: "_blank"
              }

            ]}

          />

        </Form.Item>

        <Form.Item
          label="Start Publishing"
        >

          <DatePicker
            style={{
              width: "100%"
            }}
          />

        </Form.Item>

        <Form.Item
          label="End Publishing"
        >

          <DatePicker
            style={{
              width: "100%"
            }}
          />

        </Form.Item>

        <Form.Item
          label="Image"
        >

          <Upload>

            <Button
              icon={
                <UploadOutlined />
              }
            >

              Upload Image

            </Button>

          </Upload>

        </Form.Item>

        {/* META */}

        <Divider orientation="left">

          Meta Data

        </Divider>

        <Form.Item
          label="Meta Title"
        >

          <Input
            placeholder="Enter meta title"
          />

        </Form.Item>

        <Form.Item
          label="Meta Description"
        >

          <TextArea
            rows={4}
            placeholder="Enter meta description"
          />

        </Form.Item>

        <Form.Item
          label="Meta Keywords"
        >

          <Input
            placeholder="keyword1, keyword2"
          />

        </Form.Item>

        <Button
          type="primary"
          block
        >

          Save Menu

        </Button>

      </Form>

    </Card>

  );

}