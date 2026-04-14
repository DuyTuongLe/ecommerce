// shared/hooks/useMenu.js
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function useMenu(options = {}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getMenu(options).then(setData);
  }, [JSON.stringify(options)]);

  return data;
}