<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Kategori;
use Illuminate\Http\Request;

class BukuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $buku = Buku::with('kategori')->get();

    // Ubah output untuk menyertakan kategori_name
    $buku = $buku->map(function($item) {
        return [
            'buku_id' => $item->buku_id,
            'nama' => $item->nama,
            'kategori' => $item->kategori->nama, // Ambil nama kategori
            'isbn' => $item->isbn,
            'pengarang' => $item->pengarang,
            'sinopsis' => $item->sinopsis,
            'stok' => $item->stok,
            'foto' => $item->foto,
        ];
    });

    return response()->json([
        'status' => 'success',
        'data' => $buku,
    ]);
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'kategori_id' => 'required|exists:kategori,kategori_id',
                'nama' => 'required|string|max:255',
                'isbn' => 'required|string|max:255',
                'pengarang' => 'required|string|max:255',
                'sinopsis' => 'required',
                'stok' => 'required|integer|min:1',
                'foto' => 'required|string|max:255',
            ]);
    
            Buku::create($request->all());

            Kategori::where('kategori_id', $request->kategori_id)->update([
                'is_available' => 1,
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Buku berhasil ditambahkan',
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
        $buku = Buku::find($id);

        if (!$buku) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buku tidak ditemukan',
            ], 404); // HTTP status code 404 for not found
        }

        return response()->json([
            'status' => 'success',
            'data' => $buku,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(buku $buku)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $buku = Buku::find($id);

            if (!$buku) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Buku tidak ditemukan',
                ], 404); // HTTP status code 404 for not found
            }

            $request->validate([
                'kategori_id' => 'required|exists:kategori,kategori_id',
                'nama' => 'required|string|max:255',
                'isbn' => 'required|string|max:255',
                'pengarang' => 'required|string|max:255',
                'sinopsis' => 'required',
                'stok' => 'required|integer|min:0',
                'foto' => 'required|string|max:255',
            ]);

            $buku->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Buku berhasil diubah',
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
            $buku = Buku::find($id);

        if (!$buku) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buku tidak ditemukan',
            ], 404); // HTTP status code 404 for not found
        }

        if (Buku::where('kategori_id', $buku->kategori_id)->count() == 0) {
            Kategori::where('kategori_id', $buku->kategori_id)->update([
                'is_available' => 0,
            ]);
        }

        $buku->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Buku berhasil dihapus',
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
