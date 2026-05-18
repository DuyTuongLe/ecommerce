//src/admin/pages/MenuManager.jsx

import {
  useState,
  useEffect
} from "react";

import {
  useMenus
} from "../hooks/useMenus";

import {
  useMenuGroups
} from "../hooks/useMenuGroups";

import {
  useLanguages
} from "../hooks/useLanguages";

import {
  message, Modal
} from "antd";

import MenuToolbar from "../components/MenuToolbar";

import MenuTree from "../components/MenuTree";

import { buildSortPayload } from "../components/treeUtils";

import { sortMenus, saveMenu, deleteMenu } from "../../shared/services/menuApi";

import MenuForm from "../components/MenuForm";

export default function MenuManager() {

  const [treeItems, setTreeItems] =
    useState([]);

  const [menuGroup, setMenuGroup] =
    useState(null);

  const [reLoadKey, setReloadKey] =
    useState(0);

  const [language, setLanguage] =
    useState(null);

  const [mode, setMode] = useState("add");

  const [selectedItem, setSelectedItem] = useState(null);

  const [formLanguage, setFormLanguage] = useState(null);

  const {

    menus,
    loading

  } = useMenus(

    language,

    menuGroup,

    reLoadKey

  );

  const menuGroups =
    useMenuGroups();

  const languages =
    useLanguages();

  const [formKey, setFormKey] =
    useState(0);

  useEffect(() => {

    if (!languages.length)
      return;

    const defaultLanguage =
      languages.find(
        x => x.macdinh === 1
      );

    if (
      defaultLanguage &&
      !language
    ) {

      setLanguage(
        defaultLanguage.code
      );

    }

    if (
      defaultLanguage &&
      !formLanguage
    ) {

      setFormLanguage(
        defaultLanguage.code
      );

    }

  }, [languages]);


  useEffect(() => {

    if (!menuGroups.length)
      return;

    const defaultGroup =
      menuGroups.find(
        x => x.macdinh === 1
      );

    if (
      defaultGroup &&
      !menuGroup
    ) {

      setMenuGroup(
        defaultGroup.id
      );

    }

  }, [menuGroups]);

  async function handleSave() {

    try {

      const payload =
        buildSortPayload(
          treeItems
        );

      await sortMenus(
        payload
      );

      message.success(
        "Saved successfully"
      );

    }
    catch (error) {

      console.error(error);

      message.error(
        "Save failed"
      );

    }

  }
  async function handleRemove() {

    if (!selectedItem) {

      message.warning(
        "Please select menu"
      );

      return;
    }

    Modal.confirm({

      title: "Delete Menu",

      content:
        "Are you sure to delete this menu?",

      okText: "Delete",

      okButtonProps: {
        danger: true
      },

      async onOk() {

        try {

          await deleteMenu(
            selectedItem.id
          );

          message.success(
            "Deleted successfully"
          );

          setSelectedItem(null);

          setMode("add");

          handleReload(false);

        } catch (error) {

          console.error(error);

          message.error(
            "Delete failed"
          );

        }

      }

    });

  }


  function handleReload(showMessage = true) {
    setReloadKey(
      prev => prev + 1
    );

    if (showMessage) {
      message.success(
        "Reload successful"
      );
    }
  }

  async function handleSubmit(values) {

    try {

      const payload = {

        ...values,

        goc_id:
          values.parent_id,

        ngonngu:

          mode === "add"

            ? formLanguage

            : language,

        id:
          selectedItem?.id

      };

      await saveMenu(
        payload
      );

      message.success(
        "Saved successfully"
      );

      handleReload(false);

    }
    catch (error) {

      console.error(error);

      message.error(
        "Save failed"
      );

    }

  }



  return (

    <div>

      <MenuToolbar

        languages={languages}

        language={language}

        onChangeLanguage={setLanguage}

        menuGroup={menuGroup}

        onChangeMenuGroup={setMenuGroup}

        menuGroups={menuGroups}

        onSave={handleSave}

        onReload={handleReload}

        onAdd={() => {

          setMode("add");

          setSelectedItem(null);

          setFormLanguage(language);
          setFormKey(
            prev => prev + 1
          );
        }}

        onRemove={handleRemove}

      />

      <div
        style={{

          display: "grid",

          gridTemplateColumns:
            "1fr 400px",

          gap: 20,

          minHeight:
            "calc(100vh - 140px)"
        }}
      >

        <div
          style={{

            minWidth: 0,

            height:
              "calc(100vh - 140px)",

            overflowY: "auto",

            scrollbarWidth: "none",

            msOverflowStyle: "none"

          }}
        >

          <MenuTree

            items={menus}

            onChange={
              setTreeItems
            }

            onSelect={(item) => {

              setSelectedItem(item);

              setMode("edit");

            }}

            selectedItem={
              selectedItem
            }
          />

        </div>

        <div
          style={{

          }}
        >

          <MenuForm
            key={formKey}
            mode={mode}
            language={language}
            formLanguage={formLanguage}
            setFormLanguage={
              setFormLanguage
            }
            languages={languages}
            selectedItem={selectedItem}
            menus={menus}
            menuGroups={menuGroups}
            menuGroup={menuGroup}
            onSubmit={handleSubmit}
          />

        </div>

      </div>

    </div>

  );

}