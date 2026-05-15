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

import { sortMenus } from "../../shared/services/menuApi";

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

          />

        </div>

        <div
          style={{

            overflowY: "auto",

            height: "100%"

          }}
        >

          <MenuForm />

        </div>

      </div>

    </div>

  );

}