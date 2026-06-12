// src/admin/pages/BrandManager.jsx

import { useEffect, useState } from "react";

import BrandToolbar
    from "../components/brand/BrandToolbar";

import BrandTable
    from "../components/brand/BrandTable";

import useBrands
    from "../hooks/useBrands";

import MediaPickerModal
    from "../components/media/MediaPickerModal";

import {
    useLanguages
} from "../hooks/useLanguages";

import { message, Modal } from "antd";

export default function BrandManager() {

    const {

        brands,

        loading,

        fetchBrands,

        saveBrandChanges,

        createBrand,

        deleteBrands

    } = useBrands();

    const languages = useLanguages();

    const [

        selectedRowKeys,

        setSelectedRowKeys

    ] = useState([]);

    const [

        editedRows,

        setEditedRows

    ] = useState({});

    const [

        mediaModalOpen,

        setMediaModalOpen

    ] = useState(false);

    const [

        selectedBrand,

        setSelectedBrand

    ] = useState(null);

    const [
        newBrandId,
        setNewBrandId
    ] = useState(null);

    const [

        lang,

        setLang

    ] = useState("vi");

    useEffect(() => {

        fetchBrands(lang);

    }, [lang]);

    useEffect(() => {

        console.log(
            "editedRows changed",
            editedRows
        );

    }, [editedRows]);

    function handleSelectLogo(media) {

        if (!selectedBrand) {
            return;
        }

        setEditedRows(prev => ({

            ...prev,

            [selectedBrand.id]: {

                ...selectedBrand,

                ...prev[selectedBrand.id],

                logo_id: media.id,

                logo: media.url

            }

        }));

        setMediaModalOpen(false);
    }

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                minHeight: 0
            }}
        >

            <BrandToolbar

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

                    setNewBrandId(null);

                    fetchBrands(lang);

                }}

                onCreate={async () => {

                    const result = await createBrand(lang);

                    if (
                        result?.id
                    ) {

                        setNewBrandId(
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
                        return;
                    }

                    const success =

                        await saveBrandChanges(

                            rows,

                            lang

                        );

                    if (success) {

                        setEditedRows({});

                        fetchBrands(lang);

                    }

                }}

                onDelete={async () => {

                    if (
                        selectedRowKeys.length === 0
                    ) {
                        return;
                    }

                    const result =

                        await deleteBrands(

                            selectedRowKeys,

                            lang

                        );

                    if (
                        result?.failed?.length
                    ) {

                        Modal.warning({

                            title:
                                "Không thể xóa brand!",

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

                        message.success(
                            "Deleted successfully"
                        );

                        setSelectedRowKeys([]);

                        fetchBrands(lang);

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

                <BrandTable

                    brands={brands}

                    loading={loading}

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

                    onSelectLogo={(brand) => {

                        setSelectedBrand(
                            brand
                        );

                        setMediaModalOpen(
                            true
                        );

                    }}

                    newBrandId={
                        newBrandId
                    }

                />

            </div>



            <MediaPickerModal

                open={mediaModalOpen}

                onCancel={() => {

                    setMediaModalOpen(
                        false
                    );

                }}

                onSelect={
                    handleSelectLogo
                }

            />

        </div>

    );

}