// src/admin/pages/AttributeManager.jsx

import {

    useEffect,
    useState

} from "react";

import {

    message,
    Modal

} from "antd";

import useAttributes
    from "../hooks/useAttributes";

import AttributeToolbar
    from "../components/attribute/AttributeToolbar";

import AttributeTable
    from "../components/attribute/AttributeTable";

import { useLanguages } from "../hooks/useLanguages";

export default function AttributeManager() {

    const {

        attributes,

        loading,

        fetchAttributes,

        saveAttributeChanges,

        createAttribute,

        deleteAttributes

    } = useAttributes();

    const [

        selectedRowKeys,

        setSelectedRowKeys

    ] = useState([]);

    const [

        editedRows,

        setEditedRows

    ] = useState({});

    const [

        newAttributeId,

        setNewAttributeId

    ] = useState(null);

    const languages =
        useLanguages();

    const [

        lang,

        setLang

    ] = useState("vi");

    useEffect(() => {

        fetchAttributes(
            lang
        );

    }, [lang]);

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                minHeight: 0
            }}
        >

            <AttributeToolbar

                languages={
                    languages
                }

                lang={
                    lang
                }

                onLangChange={
                    setLang
                }

                editedRows={
                    editedRows
                }

                selectedRowKeys={
                    selectedRowKeys
                }

                onReload={() => {

                    setEditedRows({});

                    setSelectedRowKeys([]);

                    setNewAttributeId(null);

                    fetchAttributes(lang);

                }}

                onCreate={async () => {

                    const result =

                        await createAttribute(lang);

                    if (
                        result?.id
                    ) {

                        setNewAttributeId(
                            result.id
                        );

                    }

                }}

                onSave={async () => {

                    const rows =

                        Object.values(
                            editedRows
                        );

                    if (
                        rows.length === 0
                    ) {

                        return null;

                    }

                    const success =

                        await saveAttributeChanges(

                            rows,

                            lang

                        );

                    if (success) {

                        setEditedRows({});

                        await fetchAttributes(lang);

                        return true;

                    }

                    return false;

                }}

                onDelete={async () => {

                    if (
                        selectedRowKeys.length === 0
                    ) {
                        return;
                    }

                    const result =

                        await deleteAttributes(

                            selectedRowKeys,

                            lang

                        );

                    if (
                        result?.failed?.length
                    ) {

                        Modal.warning({

                            title:
                                "Không thể xóa thuộc tính",

                            content: (

                                <ul>

                                    {

                                        result.failed.map(

                                            item => (

                                                <li
                                                    key={
                                                        item.id
                                                    }
                                                >

                                                    {
                                                        item.name
                                                    }

                                                    {" "}

                                                    (

                                                    {
                                                        item.value_count
                                                    }

                                                    {" values)"}

                                                </li>

                                            )

                                        )

                                    }

                                </ul>

                            )

                        });

                    }
                    
                    if (
                        result?.success
                    ) {

                        message.success(
                            "Deleted successfully"
                        );

                        setSelectedRowKeys([]);

                        fetchAttributes(lang);

                    }

                }}

            />

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "scroll"

                }}
            >
                <AttributeTable

                    attributes={
                        attributes
                    }

                    loading={
                        loading
                    }

                    selectedRowKeys={
                        selectedRowKeys
                    }

                    setSelectedRowKeys={
                        setSelectedRowKeys
                    }

                    editedRows={
                        editedRows
                    }

                    setEditedRows={
                        setEditedRows
                    }

                    newAttributeId={
                        newAttributeId
                    }

                />
            </div>

        </div>

    );

}