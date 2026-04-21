// shared/utils/flattenMenu.js

export function flattenMenu(tree, parentId = null) {
  let result = [];

  tree.forEach((item, index) => {
    const thutu = index + 1;

    result.push({
      id: item.id,
      goc_id: parentId,
      thutu
    });

    if (item.children && item.children.length > 0) {
      result = result.concat(
        flattenMenu(item.children, item.id)
      );
    }
  });

  return result;
}