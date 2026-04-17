//admin/hooks/useMenuAdmin.js
import { useEffect, useState } from "react";
import { api } from "../../shared/services/api";

export default function useMenuAdmin(lang, group, reloadKey) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!group) return; // chưa chọn group thì không load

    api.getMenuAdmin(lang, group).then(setData);
  }, [lang, group, reloadKey]);

  return data;
}