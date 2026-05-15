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

    items, onChange

  }) {

  const [treeItems, setTreeItems] =
    useState([]);

  useEffect(() => {

    const flat =
      flattenTree(items);

    setTreeItems(flat);

    onChange?.(flat);

  }, [items]);


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

    setTreeItems(

      arrayMove(

        treeItems,
        oldIndex,
        newIndex

      )

    );

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

                onIndent={
                  handleIndent
                }

                onOutdent={
                  handleOutdent
                }

              />

            ))

          }

        </SortableContext>

      </DndContext>

    </div>

  );

}