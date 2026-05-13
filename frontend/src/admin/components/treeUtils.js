// src/admin/components/treeUtils.js


export function flattenTree(

  items,

  depth = 0,

  parentId = null

) {

  let result = [];

  items.forEach(item => {

    result.push({

      ...item,

      depth,

      parentId

    });

    if (item.children) {

      result = [

        ...result,

        ...flattenTree(

          item.children,

          depth + 1,

          item.id

        )

      ];

    }

  });

  return result;

}

export function buildSortPayload(
  items
) {

  return items.map(

    (item, index) => ({

      id: item.id,

      goc_id:
        item.parentId,

      thutu:
        index + 1

    })

  );

}