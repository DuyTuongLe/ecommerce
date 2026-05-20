// src/admin/components/treeUtils.js


export function flattenTree(

  items,

  depth = 0,

  parentId = null,

  expandedIds = []

) {

  let result = [];

  items.forEach(item => {

    result.push({

      ...item,

      depth,

      parentId

    });


    const isExpanded =
      expandedIds.includes(
        item.id
      );


    if (
      item.children?.length &&
      isExpanded
    ) {

      result = [

        ...result,

        ...flattenTree(

          item.children,

          depth + 1,

          item.id,

          expandedIds

        )

      ];

    }

  });

  return result;

}

export function flattenAllTree(

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

    if (item.children?.length) {

      result = [

        ...result,

        ...flattenAllTree(

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