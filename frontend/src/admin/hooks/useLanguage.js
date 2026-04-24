//admin/hooks/useLanguage.js
import { useEffect, useState } from "react";
import { api } from "../../shared/services/api";

export default function useLanguage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getLanguages().then(res => {
      setData(res.data);
    });
  }, []);

  return data;
}