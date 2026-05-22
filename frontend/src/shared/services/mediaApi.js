// src/shared/services/mediaApi.js

import api from "./api";


export async function getMediaExplorer(
  folderId = null
) {

  const res = await api.get(
    "/admin/media",
    {
      params: {
        folder_id: folderId
      }
    }
  );

  return res.data;

}


export async function createMediaFolder(
  data
) {

  const res = await api.post(
    "/admin/media-folders",
    data
  );

  return res.data;

}

export async function updateMediaFolder(
  id,
  data
) {

  const res = await api.put(
    `/admin/media-folders/${id}`,
    data
  );

  return res.data;

}

export async function deleteMediaFolder(
  id
) {

  const res = await api.delete(
    `/admin/media-folders/${id}`
  );

  return res.data;

}


export async function uploadMedia(
  formData
) {

  const res = await api.post(

    "/admin/media/upload",

    formData,

    {

      headers: {

        "Content-Type":
          "multipart/form-data"

      }

    }

  );

  return res.data;

}


export async function deleteMedia(
  id
) {

  const res = await api.delete(
    `/admin/media/${id}`
  );

  return res.data;

}

export async function updateMedia(
  id,
  data
) {

  const res = await api.put(
    `/admin/media/${id}`,
    data
  );

  return res.data;

}

export async function moveMedia(
  data
) {

  const res = await api.post(
    "/admin/media/move",
    data
  );

  return res.data;

}

export async function moveFolder(
  data
) {

  const res = await api.post(
    "/admin/media-folders/move",
    data
  );

  return res.data;

}