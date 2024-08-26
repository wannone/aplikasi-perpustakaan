<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kategori = kategori::get();

        return response()->json([
            'status' => 'success',
            'data' => $kategori,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255',
                'is_available' => 'required|integer|min:0|max:1',
            ]);
    
            Kategori::create([
                'nama' => $request->nama,
                'is_available' => $request->is_available,
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Kategori berhasil ditambahkan',
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database query exceptions (e.g., foreign key constraint failures)
            return response()->json([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
    
        } catch (\Exception $e) {
            // Handle any other general exceptions
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $kategori = Kategori::find($id);

        if (!$kategori) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan',
            ], 404); // HTTP status code 404 for not found
        }

        return response()->json([
            'status' => 'success',
            'data' => $kategori,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(kategori $kategori)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $kategori = Kategori::find($id);

            if (!$kategori) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kategori tidak ditemukan',
                ], 404); // HTTP status code 404 for not found
            }

            $request->validate([
                'nama' => 'required|string|max:255',
                'is_available' => 'required|integer|min:0|max:1',
            ]);
    
            $kategori->update([
                'nama' => $request->nama,
                'is_available' => $request->is_available,
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Kategori berhasil diubah',
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database query exceptions (e.g., foreign key constraint failures)
            return response()->json([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
    
        } catch (\Exception $e) {
            // Handle any other general exceptions
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            $kategori = Kategori::find($id);

            if (!$kategori) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kategori tidak ditemukan',
                ], 404); // HTTP status code 404 for not found
            }

            $kategori->delete();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Kategori berhasil dihapus',
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database query exceptions (e.g., foreign key constraint failures)
            return response()->json([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
    
        } catch (\Exception $e) {
            // Handle any other general exceptions
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500); // HTTP status code 500 for server errors
        }
        
    }
}
