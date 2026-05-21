// src/admin/components/MenuForm.jsx

import {
  useEffect,
  useState
} from "react";

import {
  flattenTree, flattenAllTree
} from "./treeUtils";

import {

  Card,
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  Upload,
  Button,
  Divider,
  Space

} from "antd";

import {

  UploadOutlined

} from "@ant-design/icons";

import slugify from "slugify";

import MediaPickerModal
  from "./media/MediaPickerModal";

const {
  TextArea
} = Input;

export default function MenuForm({

  mode,

  language,

  formLanguage,

  setFormLanguage,

  languages,

  selectedItem,

  menus,

  menuGroups,

  menuGroup,

  onSubmit

}) {

  const [form] =
    Form.useForm();

  const [

    mediaModalOpen,

    setMediaModalOpen

  ] = useState(false);

  const [

    selectedThumbnail,

    setSelectedThumbnail

  ] = useState(null);

  function handleTitleBlur() {

    /*
    |--------------------------------------------------------------------------
    | Only Add Mode
    |--------------------------------------------------------------------------
    */

    if (mode !== "add") {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | User Already Edited Slug
    |--------------------------------------------------------------------------
    */

    const currentSlug =
      form.getFieldValue("slug");

    if (currentSlug) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Get Title
    |--------------------------------------------------------------------------
    */

    const title =
      form.getFieldValue(
        "danduong_nn_ten"
      );

    if (!title) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Slug
    |--------------------------------------------------------------------------
    */

    const slug = slugify(title, {

      lower: true,

      strict: true,

      locale: "vi"

    });

    /*
    |--------------------------------------------------------------------------
    | Set Form
    |--------------------------------------------------------------------------
    */

    form.setFieldValue(
      "slug",
      slug
    );

  }

  function handleSelectMedia(media) {
    form.setFieldValue(
      "thumbnail_id",
      media.id
    );

    setSelectedThumbnail(media);

    setMediaModalOpen(false);
  }

  function handleRemoveThumbnail() {
    form.setFieldValue(
      "thumbnail_id",
      null
    );

    setSelectedThumbnail(null);
  }

  const currentLanguage =

    mode === "add"

      ? formLanguage

      : language;

  const flatMenus =

    flattenAllTree(
      menus || []
    );

  const parentOptions =

    flatMenus

      .filter(item => {

        return (
          item.id !==
          selectedItem?.id
        );

      })

      .map(item => {

        const translation =
          item.ngonngus?.find(
            x =>
              x.ngonngu ===
              currentLanguage
          );

        return {

          label:
            translation
              ?.danduong_nn_ten

            ||

            "⚠ Missing Translation",

          displayLabel:

            `${"— ".repeat(item.depth)}` +

            (
              translation
                ?.danduong_nn_ten

              ||

              "⚠ Missing Translation"
            ),

          value: item.id

        };
      });

  useEffect(() => {

    if (
      mode !== "edit" ||
      !selectedItem
    ) {
      return;
    }

    const translation =
      selectedItem.ngonngus?.find(
        x =>
          x.ngonngu === language
      );

    const currentUrl =
      selectedItem.urls?.find(
        x =>
          x.ngonngu === language
      );

    form.resetFields();

    form.setFieldsValue({

      danduong_nn_ten:
        translation
          ?.danduong_nn_ten,

      mota:
        translation?.mota,

      type:
        selectedItem.type,

      trangthai:
        selectedItem.trangthai,

      thumbnail_id:
        selectedItem.thumbnail_id,

      parent_id:
        selectedItem.parentId,

      danduong_nhom_id:
        selectedItem.danduong_nhom_id,

      seo_title:
        translation?.seo_title,

      seo_description:
        translation?.seo_description,

      seo_keywords:
        translation?.seo_keywords,

      slug:
        currentUrl?.slug,

      target:
        selectedItem.target,

      external_url:
        translation?.external_url || "",

    });

    setSelectedThumbnail(
      selectedItem.thumbnail || null
    );

  }, [

    mode,

    selectedItem,

    language

  ]);


  useEffect(() => {

    if (mode !== "add")
      return;

    form.resetFields();

    form.setFieldsValue({

      danduong_nhom_id: menuGroup,

      trangthai: true,

      target: "_self"

    });

  }, [

    mode,

    menuGroup

  ]);

  return (

    <Card
      title="Add or Edit Menu"

      styles={{

        body: {

          display: "flex",
          flexDirection: "column",
          height: "calc(-140px + 100vh)",
          paddingBottom: 0

        }

      }}

    >

      <Form

        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}

      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: 6,
            scrollbarWidth: "none",
            msOverflowStyle: "none",

          }}
        >

          {/* Language */}

          {

            mode === "add" && (

              <Form.Item
                label="Language"
              >

                <Select

                  value={formLanguage}

                  onChange={
                    setFormLanguage
                  }

                  options={
                    (languages || []).map((lang => ({

                      label: lang.name,

                      value: lang.code

                    })))
                  }

                />

              </Form.Item>

            )

          }

          {/* Title */}

          <Form.Item

            name="danduong_nn_ten"

            label="Menu Title"

          >

            <Input onBlur={handleTitleBlur}
              placeholder="Enter menu title"
            />

          </Form.Item>

          <Form.Item

            shouldUpdate

            noStyle

          >

            {

              ({ getFieldValue }) => {

                const type =
                  getFieldValue("type");

                return (

                  <Form.Item
                    name="slug"
                    label="Slug"
                  >

                    <Input

                      disabled={
                        type === "external"
                      }

                    />

                  </Form.Item>

                );

              }

            }

          </Form.Item>

          {/* Description */}

          <Form.Item

            name="mota"

            label="Description"

          >

            <TextArea

              rows={4}

              placeholder="Enter description"

            />

          </Form.Item>

          {/* Menu Type */}

          <Form.Item
            name="type"
            label="Menu Type"
          >

            <Select
              placeholder="No Type"

              options={[

                {
                  label: "Page",
                  value: "page"
                },

                {
                  label: "Menu Group",
                  value: "menu_group"
                },

                {
                  label: "Product Category",
                  value: "product_category"
                },

                {
                  label: "External Link",
                  value: "external"
                }

              ]}

            />

          </Form.Item>

          <Form.Item

            shouldUpdate

            noStyle

          >

            {

              ({ getFieldValue }) => {

                const type =
                  getFieldValue("type");

                return (

                  <Form.Item

                    name="external_url"

                    label="External URL"

                    rules={[

                      {

                        required:
                          type === "external",

                        message:
                          "Please enter external URL"

                      }

                    ]}

                  >

                    <Input

                      placeholder="https://example.com"

                      disabled={
                        type !== "external"
                      }

                    />

                  </Form.Item>

                );

              }

            }

          </Form.Item>

          {/* Group */}

          <Form.Item

            name="danduong_nhom_id"

            label="Group"

          >

            <Select

              options={

                (menuGroups || []).map(group => ({

                  label:
                    group.danduong_nhom_tieude,

                  value: group.id

                }))

              }

            />

          </Form.Item>

          {/* Parent */}

          <Form.Item

            name="parent_id"

            label="Parent Item"

          >

            <Select

              allowClear

              placeholder="No Parent"

              options={parentOptions}

              optionRender={(option) => {

                return (
                  option.data.displayLabel
                );

              }}

            />

          </Form.Item>

          {/* Publish */}

          <Form.Item

            name="trangthai"

            label="Publish"

            valuePropName="checked"

          >

            <Switch />

          </Form.Item>

          {/* Target */}

          <Form.Item

            name="target"

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

          {/* Image */}

          <Form.Item
            label="Thumbnail"
          >

            <div

              style={{

                display: "flex",

                flexDirection: "column",

                gap: 12

              }}

            >

              {
                selectedThumbnail && (

                  <img

                    src={
                      selectedThumbnail.url
                    }

                    alt=""

                    style={{

                      width: "100%",

                      maxWidth: 240,

                      borderRadius: 12,

                      border:
                        "1px solid #f0f0f0"

                    }}

                  />

                )
              }

              <Space>

                <Button

                  onClick={() => {

                    setMediaModalOpen(
                      true
                    );

                  }}

                >

                  Choose Image

                </Button>

                {
                  selectedThumbnail && (

                    <Button

                      danger

                      onClick={
                        handleRemoveThumbnail
                      }

                    >

                      Remove

                    </Button>

                  )
                }

              </Space>

            </div>

          </Form.Item>

          <Form.Item
            name="thumbnail_id"
            hidden
          >
            <Input />
          </Form.Item>

          {/* META */}

          <Divider orientation="left">

            Meta Data

          </Divider>

          {/* Meta Title */}

          <Form.Item

            name="seo_title"

            label="Meta Title"

          >

            <Input
              placeholder="Enter meta title"
            />

          </Form.Item>

          {/* Meta Description */}

          <Form.Item

            name="seo_description"

            label="Meta Description"

          >

            <TextArea

              rows={4}

              placeholder="Enter meta description"

            />

          </Form.Item>

          {/* Meta Keywords */}

          <Form.Item

            name="seo_keywords"

            label="Meta Keywords"

          >

            <Input
              placeholder="keyword1, keyword2"
            />

          </Form.Item>
        </div>

        {/* Submit */}

        <div

          style={{

            position: "sticky",
            bottom: 0,
            background: "#fff",
            padding: "16px 0",
            marginTop: 12,
            zIndex: 10
          }}

        >

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              padding: "20px 0"
            }}
          >

            Save Menu

          </Button>

        </div>

      </Form>
      <MediaPickerModal

        open={mediaModalOpen}

        onCancel={() => {

          setMediaModalOpen(false);

        }}

        onSelect={handleSelectMedia}

      />
    </Card>

  );

}