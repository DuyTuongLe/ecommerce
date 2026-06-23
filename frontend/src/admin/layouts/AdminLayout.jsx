import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;

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
    GiftOutlined,
    FileTextOutlined,
} from "@ant-design/icons";

import { useState } from "react";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                width={220}
                collapsedWidth={60}
                className="admin-sidebar"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                trigger={
                    collapsed
                        ? <MenuUnfoldOutlined style={{ color: "#fff" }} />
                        : <MenuFoldOutlined style={{ color: "#fff" }} />
                }
            >
                <div className="admin-sidebar-logo">
                    {collapsed ? "CMS" : "Admin CMS"}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={["products"]}
                    items={[
                        {
                            key: "/admin/dashboard",
                            icon: <DashboardOutlined />,
                            label: <Link to="/admin/dashboard">Dashboard</Link>,
                        },
                        {
                            key: "/admin/menus",
                            icon: <MenuOutlined />,
                            label: <Link to="/admin/menus">Menu</Link>,
                        },
                        {
                            key: "/admin/media",
                            icon: <FolderOpenOutlined />,
                            label: <Link to="/admin/media">Media</Link>,
                        },
                        {
                            key: "/admin/noi-dung",
                            icon: <FileTextOutlined />,
                            label: <Link to="/admin/noi-dung">Content</Link>,
                        },
                        {
                            key: "products",
                            icon: <ShoppingOutlined />,
                            label: "Products",
                            children: [
                                {
                                    key: "/admin/products",
                                    label: <Link to="/admin/products">All Products</Link>,
                                },
                                {
                                    key: "/admin/brands",
                                    icon: <TagsOutlined />,
                                    label: <Link to="/admin/brands">Brands</Link>,
                                },
                                {
                                    key: "/admin/attributes",
                                    icon: <ApartmentOutlined />,
                                    label: <Link to="/admin/attributes">Attributes</Link>,
                                },
                                {
                                    key: "/admin/attributevalues",
                                    icon: <ApartmentOutlined />,
                                    label: <Link to="/admin/attributevalues">Attribute Values</Link>,
                                },
                            ],
                        },
                        {
                            key: "/admin/orders",
                            icon: <ShoppingCartOutlined />,
                            label: <Link to="/admin/orders">Orders</Link>,
                        },
                        {
                            key: "/admin/promotions",
                            icon: <GiftOutlined />,
                            label: <Link to="/admin/promotions">Promotions</Link>,
                        },
                    ]}
                />
            </Sider>

            <Layout className="admin-main-layout">
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
