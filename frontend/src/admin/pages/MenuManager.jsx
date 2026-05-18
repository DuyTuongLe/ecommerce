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
  message
} from "antd";

import MenuToolbar from "../components/MenuToolbar";

import MenuTree from "../components/MenuTree";

import { buildSortPayload } from "../components/treeUtils";

import { sortMenus, saveMenu } from "../../shared/services/menuApi";

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


  function handleReload() {
    setReloadKey(
      prev => prev + 1
    );

    message.success(
      "Reload successful"
    );
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

      handleReload();

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

        }}

      />

      <div
        style={{

          display: "grid",

          gridTemplateColumns:
            "1fr 400px",

          gap: 20,

          height:
            "calc(100vh - 140px)",

          overflow: "hidden"

        }}
      >

        <div
          style={{

            minWidth: 0,

            overflowY: "auto",

            height: "100%"

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

            overflowY: "auto",

            height: "100%"

          }}
        >

          <MenuForm

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