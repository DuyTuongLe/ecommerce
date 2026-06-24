<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = NguoiDung::select('id', 'name', 'email', 'role', 'permissions', 'trangthai', 'created_at')
            ->orderBy('id')
            ->get();

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:nguoidung,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,editor',
            'permissions' => 'nullable|array',
        ]);

        $user = NguoiDung::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'permissions' => $request->permissions,
            'trangthai' => true,
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->only('id', 'name', 'email', 'role', 'permissions', 'trangthai'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = NguoiDung::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('nguoidung', 'email')->ignore($id)],
            'role' => 'required|in:admin,editor',
            'permissions' => 'nullable|array',
            'trangthai' => 'boolean',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'permissions' => $request->permissions,
            'trangthai' => $request->boolean('trangthai', $user->trangthai),
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->only('id', 'name', 'email', 'role', 'permissions', 'trangthai'),
        ]);
    }

    public function changePassword(Request $request, $id)
    {
        $user = NguoiDung::findOrFail($id);

        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user->update([
            'password' => $request->password,
        ]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $user = NguoiDung::findOrFail($id);

        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Không thể xóa chính mình'], 422);
        }

        $user->delete();

        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        $currentId = Auth::id();

        if (in_array($currentId, $ids)) {
            return response()->json(['message' => 'Không thể xóa chính mình'], 422);
        }

        NguoiDung::whereIn('id', $ids)->delete();

        return response()->json(['success' => true]);
    }
}
