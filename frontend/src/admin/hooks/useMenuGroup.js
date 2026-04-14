//admin/hooks/useMenuGroup.js
import { useEffect, useState } from "react";
import { api } from "../../shared/services/api";

export default function useMenuGroup() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getMenuGroup().then(res => {
      setData(res.data); // 👈 CHỖ QUAN TRỌNG
    });
  }, []);

  return data;
}