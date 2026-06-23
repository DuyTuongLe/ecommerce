import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import NoiDungToolbar from "../components/noiDung/NoiDungToolbar";
import NoiDungTable from "../components/noiDung/NoiDungTable";
import useNoiDung from "../hooks/useNoiDung";
import { getNoiDungPages, toggleNoiDungStatus } from "../../shared/services/noiDungApi";

// Tiêu đề lấy theo ngôn ngữ này (fallback ở backend nếu thiếu bản dịch).
const DEFAULT_LANG = "vi";

export default function NoiDungManager() {

    const { items, setItems, loading, fetchList, remove } = useNoiDung();
    const navigate = useNavigate();

    const lang = DEFAULT_LANG;
    const [type, setType] = useState("");
    const [danduongId, setDanduongId] = useState(null);
    const [pages, setPages] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        getNoiDungPages(lang).then(setPages);
    }, [lang]);

    useEffect(() => {
        const params = { lang };
        if (type) params.type = type;
        if (danduongId) params.danduong_id = danduongId;
        fetchList(params);
    }, [lang, type, danduongId]);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            }}
        >
            <NoiDungToolbar
                type={type}
                onTypeChange={setType}
                pages={pages}
                danduongId={danduongId}
                onPageChange={setDanduongId}
                selectedRowKeys={selectedRowKeys}
                onReload={() => {
                    setSelectedRowKeys([]);
                    const params = { lang };
                    if (type) params.type = type;
                    if (danduongId) params.danduong_id = danduongId;
                    fetchList(params);
                }}
                onCreate={() => {
                    navigate(`/admin/noi-dung/create?lang=${lang}`);
                }}
                onEdit={() => {
                    if (selectedRowKeys.length === 1) {
                        navigate(`/admin/noi-dung/${selectedRowKeys[0]}/edit?lang=${lang}`);
                    }
                }}
                onDelete={async () => {
                    const result = await remove(selectedRowKeys, { lang });
                    if (result?.success) {
                        message.success("Deleted successfully");
                        setSelectedRowKeys([]);
                    }
                }}
            />

            <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <NoiDungTable
                    items={items}
                    loading={loading}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    onToggleStatus={async (id, checked) => {
                        setItems((prev) =>
                            prev.map((item) =>
                                item.id === id ? { ...item, trangthai: checked ? 1 : 0 } : item
                            )
                        );
                        toggleNoiDungStatus(id, checked);
                    }}
                />
            </div>
        </div>
    );
}
