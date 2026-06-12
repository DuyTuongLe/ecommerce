// src/admin/pages/AttributeValueManager.jsx

import {

    useEffect,
    useState

} from "react";

import {

    Modal

} from "antd";

import useAttributeValues
    from "../hooks/useAttributeValues";

import AttributeValueToolbar
    from "../components/attributeValue/AttributeValueToolbar";

import AttributeValueTable
    from "../components/attributeValue/AttributeValueTable";

import { useLanguages } from "../hooks/useLanguages";

export default function AttributeValueManager() {

    const {

        attributeValues,

        attributes,

        loading,

        fetchAttributeValues,

        fetchAttributes,

        saveAttributeValueChanges,

        createAttributeValue,

        deleteAttributeValues

    } = useAttributeValues();

    const [

        selectedRowKeys,

        setSelectedRowKeys

    ] = useState([]);

    const [

        editedRows,

        setEditedRows

    ] = useState({});

    const [

        newAttributeValueId,

        setNewAttributeValueId

    ] = useState(null);

    const languages =
        useLanguages();

    const [

        lang,

        setLang

    ] = useState("vi");

    useEffect(() => {

        fetchAttributeValues(
            lang
        );

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

            <AttributeValueToolbar

                languages={languages}

                lang={lang}

                onLangChange={setLang}

                editedRows={
                    editedRows
                }

                selectedRowKeys={
                    selectedRowKeys
                }

                onReload={() => {

                    setEditedRows({});

                    setSelectedRowKeys([]);

                    setNewAttributeValueId(null);

                    fetchAttributeValues(lang);

                    fetchAttributes(lang);

                }}

                onCreate={async () => {

                    const result =

                        await createAttributeValue(lang);

                    if (
                        result?.id
                    ) {

                        setNewAttributeValueId(
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

                        await saveAttributeValueChanges(
                            rows,
                            lang
                        );

                    if (success) {

                        setEditedRows({});

                        await fetchAttributeValues(lang);

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

                        await deleteAttributeValues(
                            selectedRowKeys,
                            lang
                        );

                    if (
                        result?.failed?.length
                    ) {

                        Modal.warning({

                            title:
                                "Không thể xóa giá trị thuộc tính",

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
                                                        item.product_count
                                                    }

                                                    {" products)"}

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

                        setSelectedRowKeys([]);

                        fetchAttributeValues(lang);

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
                <AttributeValueTable

                    attributeValues={
                        attributeValues
                    }

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

                    newAttributeValueId={
                        newAttributeValueId
                    }

                />
            </div>


        </div>

    );

}