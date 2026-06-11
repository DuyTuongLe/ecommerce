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

    useEffect(() => {

        fetchAttributes();

    }, []);

    return (

        <div>

            <AttributeToolbar

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

                    fetchAttributes();

                }}

                onCreate={async () => {

                    const result =

                        await createAttribute();

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
                            rows
                        );

                    if (success) {

                        setEditedRows({});

                        await fetchAttributes();

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
                            selectedRowKeys
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

                        setSelectedRowKeys([]);

                        fetchAttributes();

                    }

                }}

            />

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

    );

}