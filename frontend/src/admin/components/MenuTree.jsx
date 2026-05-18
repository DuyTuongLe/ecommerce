// src/admin/components/MenuTree.jsx

import {

  DndContext,
  closestCenter

} from "@dnd-kit/core";

import {

  SortableContext,
  verticalListSortingStrategy,
  arrayMove

} from "@dnd-kit/sortable";

import {

  useEffect,
  useState

} from "react";

import SortableTreeItem
  from "./SortableTreeItem";

import {

  flattenTree,
  buildSortPayload

} from "./treeUtils";

import {

  sortMenus

} from "../../shared/services/menuApi";

export default function
  MenuTree({

    items, onChange, onSelect, selectedItem

  }) {

  const [treeItems, setTreeItems] =
    useState([]);

  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    const rootIds = [];

    items.forEach(item => {

      if (item.children?.length) {

        rootIds.push(item.id);

      }

    });

    setExpandedIds(rootIds);

  }, [items]);

  useEffect(() => {

    const flat = flattenTree(items, 0, null, expandedIds);

    setTreeItems(flat);

    onChange?.(flat);

  }, [items, expandedIds]);


  function handleDragEnd(event) {

    const {

      active,
      over

    } = event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex =
      treeItems.findIndex(
        item =>
          item.id === active.id
      );

    const newIndex =
      treeItems.findIndex(
        item =>
          item.id === over.id
      );

    const updated = arrayMove(

      treeItems,
      oldIndex,
      newIndex

    );

    setTreeItems(updated);

    onChange?.(updated);

  }


  function handleIndent(id) {

    const updated =
      [...treeItems];

    const index =
      updated.findIndex(
        item => item.id === id
      );

    if (index <= 0) {
      return;
    }

    const current =
      updated[index];

    const prev =
      updated[index - 1];

    current.depth =
      prev.depth + 1;

    current.parentId =
      prev.id;

    setTreeItems(updated);

  }

  /*
  |--------------------------------------------------------------------------
  | Remove Child
  |--------------------------------------------------------------------------
  */

  function handleOutdent(id) {

    const updated =
      [...treeItems];

    const index =
      updated.findIndex(
        item => item.id === id
      );

    const current =
      updated[index];

    current.depth =
      Math.max(
        current.depth - 1,
        0
      );

    /*
    |--------------------------------------------------------------------------
    | Find New Parent
    |--------------------------------------------------------------------------
    */

    current.parentId = null;

    for (

      let i = index - 1;

      i >= 0;

      i--

    ) {

      const prev =
        updated[i];

      if (
        prev.depth ===
        current.depth - 1
      ) {

        current.parentId =
          prev.id;

        break;

      }

    }

    setTreeItems(updated);

  }


  function toggleExpand(id) {

  setExpandedIds(prev => {

    /*
    |--------------------------------------------------------------------------
    | Collapse
    |--------------------------------------------------------------------------
    */

    if (prev.includes(id)) {

      return prev.filter(
        x => x !== id
      );

    }

    /*
    |--------------------------------------------------------------------------
    | Expand
    |--------------------------------------------------------------------------
    */

    return [

      ...prev,

      id

    ];

  });

}


  return (

    <div>

      {/* Tree */}

      <DndContext

        collisionDetection={
          closestCenter
        }

        onDragEnd={
          handleDragEnd
        }

      >

        <SortableContext

          items={

            treeItems.map(
              item => item.id
            )

          }

          strategy={
            verticalListSortingStrategy
          }

        >

          {

            treeItems.map(item => (

              <SortableTreeItem

                key={item.id}

                item={item}

                expandedIds={expandedIds}

                onToggleExpand={toggleExpand}

                onIndent={
                  handleIndent
                }

                onOutdent={
                  handleOutdent
                }

                onSelect={onSelect}

                active={selectedItem?.id === item.id}

              />

            ))

          }

        </SortableContext>

      </DndContext>

    </div>

  );

}