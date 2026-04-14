// shared/components/Menu.jsx
import useMenu from "../hooks/useMenu";
import { Link } from "react-router-dom";
import { useMemo } from "react";


function buildTree(data) {
  const map = {};
  const roots = [];

  data.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  data.forEach(item => {
    if (item.goc_id === null) {
      roots.push(map[item.id]);
    } else {
      map[item.goc_id]?.children.push(map[item.id]);
    }
  });

  return roots;
}

export default function Menu() {
  const raw = useMenu({ lang: "vi" });
  const menu = useMemo(() => buildTree(raw), [raw]);

  const render = (items, level = 1) => (
    <ul className={`menu-level-${level} ${level === 1 ? 'flex' :''}`}>
      {items.map(i => (
        <li key={i.id} className={`list-menu-${level}`}>
          <Link to={`/${i.slug}`}>
            {i.ten}
          </Link>

          {i.children?.length > 0 && render(i.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  return render(menu);
}