// shared/utils/buildTreeFromFlat.js

export function buildTreeFromFlat(flat) {
  const map = {};
  const roots = [];

  flat.forEach(item => {
    map[item.id] = {
      ...item.data,
      children: []
    };
  });

  flat.forEach(item => {
    if (item.parentId) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
}