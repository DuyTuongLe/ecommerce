const API_URL = "http://localhost:8000/api";

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

export async function getAdminMenus(
  lang = "vi"
) {

  const res = await fetch(

    `${API_URL}/admin/menus?lang=${lang}`

  );

  return await res.json();
}

export async function getProductCategories(
  lang = "vi"
) {

  const res = await fetch(

    `${API_URL}/admin/product-categories?lang=${lang}`

  );

  return await res.json();
}

/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/

export async function getHeaderMenu(
  lang = "vi"
) {

  const res = await fetch(

    `${API_URL}/menus/header?lang=${lang}`

  );

  return await res.json();
}

export async function getFrontendProductMenu(
  lang = "vi"
) {

  const res = await fetch(

    `${API_URL}/menus/product-menu?lang=${lang}`

  );

  return await res.json();
}