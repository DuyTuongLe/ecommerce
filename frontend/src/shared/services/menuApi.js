// shared/services/menuApi.js

import api from "./api";


export async function getLanguages() {
  const res = await api.get(
    "/admin/languages"
  );

  return res.data;
}
/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

export async function getAdminMenus(lang = "vi", groupId = 1) {

  const res = await api.get(
    "/admin/menus",
    {
      params: { lang, group_id: groupId }
    }
  );

  return res.data;
}

export async function getProductCategories(lang = "vi") {

  const res = await api.get(
    "/admin/product-categories",
    {
      params: { lang }
    }
  );

  return res.data;
}

export async function getMenuGroups() {

  const res = await api.get(
    "/admin/menu-groups"
  );

  return res.data;

}

export async function sortMenus(items) {
  const res = await api.post(
    "/admin/menus/sort",
    items
  );
  return res.data;
}

export async function saveMenu(data) {
  const res = await api.post(
    "/admin/menus",
    data
  );
  return res.data;
}

/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/

export async function getHeaderMenu(lang = "vi") {

  const res = await api.get(
    "/menus/header",
    {
      params: { lang }
    }
  );

  return res.data;
}

export async function getFrontendProductMenu(lang = "vi") {

  const res = await api.get(
    "/menus/product-menu",
    {
      params: { lang }
    }
  );

  return res.data;
}