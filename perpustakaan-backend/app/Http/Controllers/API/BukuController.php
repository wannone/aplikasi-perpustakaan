<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BukuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $buku = Buku::with('kategori')->get();

            $buku = $buku->map(function($item) {
                return [
                    'buku_id' => $item->buku_id,
                    'nama' => $item->nama,
                    'kategori' => $item->kategori->nama, 
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
        ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
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
        $request->validate([
            'kategori_id' => 'required|exists:kategori,kategori_id',
            'nama' => 'required|string|max:255',
            'isbn' => 'required|string|max:255',
            'pengarang' => 'required|string|max:255',
            'sinopsis' => 'required',
            'stok' => 'required|integer|min:1',
            'foto' => 'required | image | max:2048',
        ]);

        try {
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/buku', $filename);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Warning: Foto buku tidak ditemukan',
                ], 400);
            }

            DB::beginTransaction();

            Buku::create(
                [
                    'kategori_id' => $request->kategori_id,
                    'nama' => $request->nama,
                    'isbn' => $request->isbn,
                    'pengarang' => $request->pengarang,
                    'sinopsis' => $request->sinopsis,
                    'stok' => $request->stok,
                    'foto' => $filename,
                ]
            );

            Kategori::where('kategori_id', $request->kategori_id)->update([
                'is_available' => 1,
            ]);

            DB::commit();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Buku berhasil ditambahkan',
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error: ' . $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $buku = Buku::find($id);

        if (!$buku) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buku tidak ditemukan',
            ], 404); 
        }

        return response()->json([
            'status' => 'success',
            'data' => $buku,
        ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
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
            $request->validate([
                'kategori_id' => 'required|exists:kategori,kategori_id',
                'nama' => 'required|string|max:255',
                'isbn' => 'required|string|max:255',
                'pengarang' => 'required|string|max:255',
                'sinopsis' => 'required',
                'stok' => 'required|integer|min:0',
                'foto' => 'nullable|image|max:2048',
            ]);
    
            DB::beginTransaction();

            $buku = Buku::find($id);
    
            if (!$buku) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Buku tidak ditemukan',
                ], 404);
            }
    
            $oldKategoriId = $buku->kategori_id;
    
            if ($request->hasFile('foto')) {
                if ($buku->foto && Storage::exists('public/buku/' . $buku->foto)) {
                    Storage::delete('public/buku/' . $buku->foto);
                }
        
                $file = $request->file('foto');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/buku', $filename);
        
                $buku->foto = $filename;
            }
    
            $buku->update([
                'kategori_id' => $request->kategori_id,
                'nama' => $request->nama,
                'isbn' => $request->isbn,
                'pengarang' => $request->pengarang,
                'sinopsis' => $request->sinopsis,
                'stok' => $request->stok,
                'foto' => $buku->foto, 
            ]);
    
            if (Buku::where('kategori_id', $oldKategoriId)->count() == 0) {
                Kategori::where('kategori_id', $oldKategoriId)->update([
                    'is_available' => 0,
                ]);
            }
    
            Kategori::where('kategori_id', $request->kategori_id)->update([
                'is_available' => 1,
            ]);
    
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Buku berhasil diubah',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error: ' . $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {

            DB::beginTransaction();
        
            $buku = Buku::find($id);

            if (!$buku) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Buku tidak ditemukan',
                ], 404);
            }

            if ($buku->foto && Storage::exists('public/buku/' . $buku->foto)) {
                Storage::delete('public/buku/' . $buku->foto);
            }
        
            $buku->delete();
        
            if (Buku::where('kategori_id', $buku->kategori_id)->count() == 0) {
                Kategori::where('kategori_id', $buku->kategori_id)->update([
                    'is_available' => 0,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Buku berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
}