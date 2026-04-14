export function buildTree(data, parent = null) {
  return data
    .filter(i => i.goc_id === parent)
    .map(i => ({
      ...i,
      children: buildTree(data, i.id)
    }));
}