//admin/hooks/useMenuAdmin.js
import { useEffect, useState } from "react";
import { api } from "../../shared/services/api";

export default function useMenuAdmin(lang) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getMenuAdmin(lang).then(setData);
  }, [lang]);

  return data;
}