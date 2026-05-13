import {
  useState
} from "react";

import {
  useMenus
} from "../hooks/useMenus";

import {
  useMenuGroups
} from "../hooks/useMenuGroups";

import {
  message
} from "antd";

import MenuToolbar from "../components/MenuToolbar";

import MenuTree from "../components/MenuTree";

import { buildSortPayload } from "../components/treeUtils";

import { sortMenus } from "../../shared/services/menuApi";

export default function MenuManager() {

  const [treeItems, setTreeItems] =
    useState([]);

  const [language, setLanguage] =
    useState("vi");

  const [menuGroup, setMenuGroup] =
    useState(1);

  const {

    menus,
    loading

  } = useMenus(

    language,

    menuGroup

  );

  const groups =
    useMenuGroups();


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
  return (

    <div>

      <MenuToolbar

        language={language}

        onChangeLanguage={setLanguage}

        menuGroup={menuGroup}

        onChangeMenuGroup={
          setMenuGroup
        }

        groups={groups}

        onSave={handleSave}

      />

      <MenuTree

        items={menus}

        onChange={
          setTreeItems
        }

      />

    </div>

  );

}