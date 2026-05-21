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
  MenuUnfoldOutlined,
  FolderOpenOutlined,
  ShoppingCartOutlined

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
              key: "product",
              icon: <ShoppingCartOutlined />,
              label: (
                <Link to="/admin/product">
                  Product
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