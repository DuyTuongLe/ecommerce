///admin/hooks/useMenuGroups.js

import {
  useEffect,
  useState
} from "react";

import {
  getMenuGroups
} from "../../shared/services/menuApi";

export function useMenuGroups() {

  const [groups, setGroups] =
    useState([]);

  useEffect(() => {

    async function fetchGroups() {

      try {

        const data =
          await getMenuGroups();

        setGroups(data);

      }
      catch (error) {

        console.error(error);

      }

    }

    fetchGroups();

  }, []);

  return groups;

}