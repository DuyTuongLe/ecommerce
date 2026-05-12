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

export default function AdminLayout() {

  return (

    <Layout
      style={{
        minHeight: "100vh"
      }}
    >

      {/* Sidebar */}

      <Sider
        width={300}
        theme="light"
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
              label: (
                <Link to="/admin/dashboard">
                  Dashboard
                </Link>
              )
            },

            {
              key: "menus",
              label: (
                <Link to="/admin/menus">
                  Menu Manager
                </Link>
              )
            },

            {
              key: "products",
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

      <Layout>

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
            padding: 20
          }}
        >

          <Outlet />

        </Content>

      </Layout>

    </Layout>
  );
}