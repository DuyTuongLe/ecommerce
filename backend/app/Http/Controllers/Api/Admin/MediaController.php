<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Media;
use App\Models\MediaFolder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    //
    public function index(
        Request $request
    ) {
        $folderId =
            $request->folder_id;
        $folders =
            MediaFolder::query()

            ->where(
                'parent_id',
                $folderId
            )

            ->orderBy('name')

            ->get();

        $media =
            Media::query()

            ->where(
                'folder_id',
                $folderId
            )

            ->latest()

            ->get();
        $currentFolder = null;

        if ($folderId) {

            $currentFolder =
                MediaFolder::find(
                    $folderId
                );
        }

        return response()->json([

            'current_folder' =>
            $currentFolder,

            'folders' => $folders,

            'media' => $media

        ]);
    }

    public function storeFolder(
        Request $request
    ) {
        /*
    |--------------------------------------------------------------------------
    | Validate
    |--------------------------------------------------------------------------
    */

        $request->validate([

            'name' => [

                'required',

                'max:255',
                'regex:/^[\pL\pN\s\-_]+$/u',

                Rule::unique(
                    'media_folders',
                    'name'
                )

                    ->where(function ($query)
                    use ($request) {

                        return $query->where(

                            'parent_id',

                            $request->parent_id

                        );
                    })

            ],

            'parent_id' => [
                'nullable',
                'exists:media_folders,id'
            ]

        ]);

        /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

        $folder =
            MediaFolder::create([

                'name' =>
                $request->name,

                'parent_id' =>
                $request->parent_id

            ]);

        /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

        return response()->json([

            'success' => true,

            'folder' => $folder

        ]);
    }

    public function updateFolder(

        Request $request,

        $id

    ) {

        $folder =
            MediaFolder::findOrFail(
                $id
            );

        $request->validate([

            'name' => [

                'required',

                'max:255',
                'regex:/^[\pL\pN\s\-_]+$/u',

                Rule::unique(
                    'media_folders',
                    'name'
                )

                    ->ignore($folder->id)

                    ->where(function ($query)
                    use ($folder) {

                        if (
                            $folder->parent_id
                        ) {

                            return $query->where(

                                'parent_id',

                                $folder->parent_id

                            );
                        }

                        return $query->whereNull(
                            'parent_id'
                        );
                    })

            ]

        ], [

            'name.unique' =>
            'Folder already exists',

            'name.regex' =>

            'Folder name cannot contain special characters'

        ]);

        $folder->update([

            'name' =>
            $request->name

        ]);

        return response()->json([

            'success' => true,

            'folder' => $folder

        ]);
    }

    public function update(

        Request $request,

        $id

    ) {

        $request->validate([

            'alt' => [

                'required',

                'max:255',

                'regex:/^[\pL\pN\s\-_]+$/u'

            ]

        ], [

            'alt.required' =>

            'Alt text is required',

            'alt.regex' =>

            'Alt text cannot contain special characters'

        ]);

        $media =
            Media::findOrFail($id);

        $media->update([

            'alt' =>
            $request->alt

        ]);

        return response()->json([

            'success' => true,

            'media' => $media

        ]);
    }

    public function destroyFolder(
        $id
    ) {

        $folder =
            MediaFolder::findOrFail(
                $id
            );

        if (

            $folder->children()
            ->exists()

        ) {

            return response()->json([

                'success' => false,

                'message' =>
                'Folder has subfolders'

            ], 422);
        }

        if (

            $folder->media()
            ->exists()

        ) {

            return response()->json([

                'success' => false,

                'message' =>
                'Folder contains files'

            ], 422);
        }

        $folder->delete();

        return response()->json([

            'success' => true

        ]);
    }

    public function upload(
        Request $request
    ) {

        $request->validate([

            'file' => [

                'required',

                'file',

                'max:10240'

            ],

            'folder_id' => [

                'nullable',

                'exists:media_folders,id'

            ]

        ]);

        $file =
            $request->file(
                'file'
            );

        $originalName =
            pathinfo(

                $file
                    ->getClientOriginalName(),

                PATHINFO_FILENAME

            );

        $alt = $originalName;

        $extension =
            $file
            ->getClientOriginalExtension();

        $baseFilename =
            Str::slug(
                $originalName
            );


        if (empty($baseFilename)) {

            $baseFilename =
                'file';
        }


        $filename =
            $baseFilename;

        $counter = 1;


        $directory =
            'uploads/' .
            date('Y/m');

        while (

            Storage::disk('public')
            ->exists(

                $directory .
                    '/' .
                    $filename .
                    '.' .
                    $extension

            )

        ) {

            $filename =

                $baseFilename .
                '-' .
                $counter;

            $counter++;
        }

        $path =

            $file->storeAs(

                $directory,

                $filename .
                    '.' .
                    $extension,

                'public'

            );

        /*
    |--------------------------------------------------------------------------
    | Save DB
    |--------------------------------------------------------------------------
    */

        $media =
            Media::create([

                'folder_id' =>
                $request->folder_id,

                'disk' => 'public',

                'path' => $path,

                'filename' =>

                $filename .
                    '.' .
                    $extension,

                'alt' => $alt,

                'mime_type' =>

                $file
                    ->getMimeType(),

                'extension' =>

                $file
                    ->getClientOriginalExtension(),

                'size' =>

                $file
                    ->getSize()

            ]);

        /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

        return response()->json([

            'success' => true,

            'media' => $media

        ]);
    }

    public function destroyMedia(
        $id
    ) {

        /*
    |--------------------------------------------------------------------------
    | Find
    |--------------------------------------------------------------------------
    */

        $media =
            Media::findOrFail(
                $id
            );

        /*
    |--------------------------------------------------------------------------
    | Delete Physical File
    |--------------------------------------------------------------------------
    */

        if (

            Storage::disk('public')
            ->exists($media->path)

        ) {

            Storage::disk('public')
                ->delete($media->path);
        }

        /*
    |--------------------------------------------------------------------------
    | Delete DB
    |--------------------------------------------------------------------------
    */

        $media->delete();

        /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

        return response()->json([

            'success' => true

        ]);
    }

    public function moveMedia(Request $request)
    {
        $request->validate([

            'media_ids' => ['required', 'array'],

            'folder_id' => ['nullable', 'exists:media_folders,id']

        ]);

        Media::whereIn(

            'id',

            $request->media_ids

        )->update([

            'folder_id' => $request->folder_id

        ]);

        return response()->json([

            'message' => 'Media moved successfully'

        ]);
    }

    public function moveFolder(
    Request $request
) {

    $request->validate([

        'folder_id' => [
            'required',
            'exists:media_folders,id'
        ],

        'parent_id' => [
            'nullable',
            'exists:media_folders,id'
        ]

    ]);

    /*
    |--------------------------------------------------------------------------
    | PREVENT SELF PARENT
    |--------------------------------------------------------------------------
    */

    if (
        $request->folder_id ==
        $request->parent_id
    ) {

        return response()->json([

            'message' =>
                'Invalid move'

        ], 422);

    }

    $folder = MediaFolder::findOrFail(
        $request->folder_id
    );

    $folder->update([

        'parent_id' =>
            $request->parent_id

    ]);

    return response()->json([

        'message' =>
            'Folder moved successfully'

    ]);
}
}
