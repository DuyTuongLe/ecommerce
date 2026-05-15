// src/admin/hooks/useMenus.js

import {
  useEffect,
  useState
} from "react";

import {
  getAdminMenus
} from "../../shared/services/menuApi";

export function useMenus(

  language = "vi",

  groupId = 1,

  reloadKey = 0

) {

  const [menus, setMenus] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchMenus() {

      try {

        setLoading(true);

        const data =
          await getAdminMenus(

            language,

            groupId

          );

        setMenus(data);

      }
      catch (error) {

        console.error(error);

      }
      finally {

        setLoading(false);

      }

    }

    fetchMenus();

  }, [

    language,
    groupId,
    reloadKey

  ]);

  return {

    menus,
    loading

  };

}