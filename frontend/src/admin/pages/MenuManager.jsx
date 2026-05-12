import {
  useState
} from "react";

import {
  useMenus
} from "../hooks/useMenus";

import {
  useMenuGroups
} from "../hooks/useMenuGroups";

import MenuTable from "../components/MenuTable";

import MenuToolbar from "../components/MenuToolbar";

export default function MenuManager() {

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
  console.log(groups);
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

      />

      <MenuTable

        data={menus}

        loading={loading}

      />

    </div>

  );

}