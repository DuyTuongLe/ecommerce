//src/admin/hooks/useLanguages.js


import {
  useEffect,
  useState
} from "react";

import {
  getLanguages
} from "../../shared/services/menuApi";

export function useLanguages() {

  const [languages, setLanguages] =
    useState([]);

  useEffect(() => {

    async function fetchLanguages() {

      try {

        const data =
          await getLanguages();

        setLanguages(data);

      }
      catch (error) {

        console.error(error);

      }

    }

    fetchLanguages();

  }, []);

  return languages;

}