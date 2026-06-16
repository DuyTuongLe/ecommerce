// src/admin/layouts/AdminLayout.jsx

import {
  Outlet,
  Link
} from "react-router-dom";

import {
  Layout,
  Menu
} from "antd";

const {
  Sider,
  Header,
  Content
} = Layout;

import {

  DashboardOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOpenOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  ApartmentOutlined,
  GiftOutlined

} from "@ant-design/icons";

import { useState } from "react";

export default function AdminLayout() {

  const [collapsed, setCollapsed] = useState(false);

  return (

    <Layout
      style={{
        minHeight: "100vh"
      }}
    >

      {/* Sidebar */}

      <Sider
        width={200}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      >

        <div
          style={{
            padding: 20,
            fontWeight: "bold"
          }}
        >
          Admin CMS
        </div>

        <Menu
          mode="inline"
          items={[

            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: (
                <Link to="/admin/dashboard">
                  Dashboard
                </Link>
              )
            },

            {
              key: "menus",
              icon: <MenuOutlined />,
              label: (
                <Link to="/admin/menus">
                  Menu Manager
                </Link>
              )
            },

            {
              key: "media",
              icon: <FolderOpenOutlined />,
              label: (
                <Link to="/admin/media">
                  File Manager
                </Link>
              )
            },

            {
              key: "products",
              icon: <ShoppingOutlined />,
              label: "Products",

              children: [

                {
                  key: "/admin/products",

                  label: (

                    <Link to="/admin/products">

                      All Products

                    </Link>

                  )
                },

                {
                  key: "/admin/brands",

                  icon: <TagsOutlined />,

                  label: (

                    <Link to="/admin/brands">

                      Brands

                    </Link>

                  )
                },

                {
                  key: "/admin/attributes",

                  icon: <ApartmentOutlined />,

                  label: (

                    <Link to="/admin/attributes">

                      Attributes

                    </Link>

                  )
                },

                {
                  key: "/admin/attributevalues",

                  icon: <ApartmentOutlined />,

                  label: (

                    <Link to="/admin/attributevalues">

                      Attributes Value

                    </Link>

                  )
                },

                {
                  key: "/admin/orders",

                  icon: <ShoppingCartOutlined />,

                  label: (

                    <Link to="/admin/orders">

                      Orders

                    </Link>

                  )
                },

                {
                  key: "/admin/promotions",

                  icon: <GiftOutlined />,

                  label: (

                    <Link to="/admin/promotions">

                      Promotions

                    </Link>

                  )
                }

              ]
            }

          ]}
        />

      </Sider>

      {/* Main */}

      <Layout
        style={{
          height: "100vh",
          overflow: "hidden"
        }}
      >

        <Content>

          <Outlet />

        </Content>

      </Layout>

    </Layout>
  );
}