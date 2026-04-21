// shared/utils/flattenTreeWithDepth.js

export function flattenTreeWithDepth(tree, parentId = null, depth = 0) {
  let result = [];

  tree.forEach((item) => {
    result.push({
      id: item.id,
      parentId,
      depth,
      data: item
    });

    if (item.children?.length) {
      result = result.concat(
        flattenTreeWithDepth(item.children, item.id, depth + 1)
      );
    }
  });

  return result;
}