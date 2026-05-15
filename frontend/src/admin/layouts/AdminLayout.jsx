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
  ShoppingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined

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
              key: "products",
              icon: <ShoppingOutlined />,
              label: (
                <Link to="/admin/products">
                  Products
                </Link>
              )
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

        {/* Header */}

        <Header
          style={{
            background: "#fff",
            paddingInline: 20
          }}
        >

          Admin Panel

        </Header>

        {/* Content */}

        <Content
          style={{
            padding: 20,
            overflow: "hidden"
          }}
        >

          <Outlet />

        </Content>

      </Layout>

    </Layout>
  );
}