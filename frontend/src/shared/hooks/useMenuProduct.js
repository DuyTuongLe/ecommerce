import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function useMenuProduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getMenuProduct().then(setData);
  }, []);

  return data;
}