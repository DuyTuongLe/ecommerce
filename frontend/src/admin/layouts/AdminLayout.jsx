import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Tooltip } from "antd";
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
    GlobalOutlined,
    LogoutOutlined,
    TeamOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import MediaPickerModal from "../components/media/MediaPickerModal";
import { resolveMediaPicker, cancelMediaPicker } from "../components/common/mediaPickerBridge";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleOpenMediaPicker = useCallback(() => setMediaPickerOpen(true), []);
    useEffect(() => {
        window.addEventListener("open-media-picker", handleOpenMediaPicker);
        return () => window.removeEventListener("open-media-picker", handleOpenMediaPicker);
    }, [handleOpenMediaPicker]);

    async function handleLogout() {
        await logout();
        navigate("/admin/login");
    }

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
                <div className="admin-sidebar-logo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{collapsed ? "CMS" : "Admin CMS"}</span>
                    {!collapsed && (
                        <Tooltip title={`Logout (${user?.name})`}>
                            <Button
                                type="text"
                                size="small"
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                style={{ color: "rgba(255,255,255,0.6)" }}
                            />
                        </Tooltip>
                    )}
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
                            key: "/admin/languages",
                            icon: <GlobalOutlined />,
                            label: <Link to="/admin/languages">Languages</Link>,
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
                        {
                            key: "/admin/users",
                            icon: <TeamOutlined />,
                            label: <Link to="/admin/users">Users</Link>,
                        },
                        {
                            key: "/admin/settings",
                            icon: <SettingOutlined />,
                            label: <Link to="/admin/settings">Settings</Link>,
                        },
                    ]}
                />
            </Sider>

            <Layout className="admin-main-layout">
                <Content>
                    <Outlet />
                </Content>
            </Layout>

            <MediaPickerModal
                open={mediaPickerOpen}
                onCancel={() => { setMediaPickerOpen(false); cancelMediaPicker(); }}
                onSelect={(media) => { setMediaPickerOpen(false); resolveMediaPicker(media); }}
            />
        </Layout>
    );
}
