<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use App\Models\Buku;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use DateTime;

class PeminjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $peminjaman = peminjaman::with('peminjam', 'petugas', 'buku')->get();

            $peminjaman = $peminjaman->map(function($item) {
                return [
                    'peminjaman_id' => $item->peminjaman_id,
                    'peminjam' => $item->peminjam->nama,
                    'petugas' => $item->petugas->nama,
                    'buku' => $item->buku->nama,
                    'waktu_peminjaman' => $item->waktu_peminjaman,
                    'durasi_peminjaman_in_days' => $item->durasi_peminjaman_in_days,
                    'waktu_pengembalian' => $item->waktu_pengembalian ?? null,
                    'total_keterlambatan_in_days' => $item->total_keterlambatan_in_days ?? 0,
                    'total_denda' => $item->total_denda ?? 0,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $peminjaman,
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'peminjam_email' => 'required | exists:users,email',
                'petugas_user_id' => 'required | exists:users,user_id',
                'buku_id' => 'required | exists:buku,buku_id',
                'waktu_peminjaman' => 'required | date',
                'durasi_peminjaman_in_days' => 'required | integer | min:1 | max:5',
            ]);

            DB::beginTransaction();

            $buku = buku::find($request->buku_id);

            if ($buku->stok <= 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stok buku tidak tersedia',
                ], 400);
            }

            $peminjam_user_id = User::where('email', $request->peminjam_email)->first()->user_id;

            $peminjaman = peminjaman::create([
                'peminjam_user_id' => $peminjam_user_id,
                'petugas_user_id' => $request->petugas_user_id,
                'buku_id' => $request->buku_id,
                'waktu_peminjaman' => $request->waktu_peminjaman,
                'durasi_peminjaman_in_days' => $request->durasi_peminjaman_in_days,
                'waktu_pengembalian' => null,
                'total_keterlambatan_in_days' => null,
                'total_denda' => null,
            ]);

            $buku->update([
                'stok' => $buku->stok - 1,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Peminjaman berhasil ditambahkan',
                //'data' => $peminjaman,
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
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $peminjaman = peminjaman::with('peminjam', 'petugas', 'buku')->find($id);

            if ($peminjaman) {
                $peminjaman = [
                    'peminjaman_id' => $peminjaman->peminjaman_id,
                    'peminjam' => $peminjaman->peminjam->nama,
                    'petugas' => $peminjaman->petugas->nama,
                    'buku' => $peminjaman->buku->nama,
                    'waktu_peminjaman' => $peminjaman->waktu_peminjaman,
                    'durasi_peminjaman_in_days' => $peminjaman->durasi_peminjaman_in_days,
                    'waktu_pengembalian' => $peminjaman->waktu_pengembalian ?? null,
                    'total_keterlambatan_in_days' => $peminjaman->total_keterlambatan_in_days ?? 0,
                    'total_denda' => $peminjaman->total_denda ?? 0,
                ];
                return response()->json([
                    'status' => 'success',
                    'data' => $peminjaman,
                ], 200);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Peminjaman tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function showOnRent(){
        try {
            $peminjaman = peminjaman::with('peminjam', 'petugas', 'buku')
            ->whereNull('waktu_pengembalian')
            ->get();
                    
            $peminjaman = $peminjaman->map(function($item) {
                return [
                    'peminjaman_id' => $item->peminjaman_id,
                    'peminjam' => $item->peminjam->nama,
                    'petugas' => $item->petugas->nama,
                    'buku' => $item->buku->nama,
                    'isbn' => $item->buku->isbn,
                    'pengarang' => $item->buku->pengarang,
                    'waktu_peminjaman' => $item->waktu_peminjaman,
                    'durasi_peminjaman_in_days' => $item->durasi_peminjaman_in_days,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $peminjaman,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the peminjaman for specific user.
     */
    public function showByPeminjam(int $user_id)
    {
        try {
            $peminjaman = peminjaman::
                with('peminjam', 'petugas', 'buku')
                ->where('peminjam_user_id', $user_id)
                ->get();

            $peminjaman = $peminjaman->map(function($item) {
                return [
                    'peminjaman_id' => $item->peminjaman_id,
                    'peminjam' => $item->peminjam->nama,
                    'petugas' => $item->petugas->nama,
                    'buku' => $item->buku->nama,
                    'waktu_peminjaman' => $item->waktu_peminjaman,
                    'durasi_peminjaman_in_days' => $item->durasi_peminjaman_in_days,
                    'waktu_pengembalian' => $item->waktu_pengembalian ?? null,
                    'total_keterlambatan_in_days' => $item->total_keterlambatan_in_days ?? 0,
                    'total_denda' => $item->total_denda ?? 0,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $peminjaman,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the peminjaman for specific user.
     */
    public function showByPetugas(int $user_id)
    {
        try {
            $peminjaman = peminjaman::
                with('peminjam', 'petugas', 'buku')
                ->where('petugas_user_id', $user_id)
                ->get();

            $peminjaman = $peminjaman->map(function($item) {
                return [
                    'peminjaman_id' => $item->peminjaman_id,
                    'peminjam' => $item->peminjam->nama,
                    'petugas' => $item->petugas->nama,
                    'buku' => $item->buku->nama,
                    'waktu_peminjaman' => $item->waktu_peminjaman,
                    'durasi_peminjaman_in_days' => $item->durasi_peminjaman_in_days,
                    'waktu_pengembalian' => $item->waktu_pengembalian ?? null,
                    'total_keterlambatan_in_days' => $item->total_keterlambatan_in_days ?? 0,
                    'total_denda' => $item->total_denda ?? 0,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $peminjaman,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(peminjaman $peminjaman)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        DB::beginTransaction();
        
        try {
            $request->validate([
                'waktu_pengembalian' => 'required | date',
            ]);

            $peminjaman = peminjaman::find($id);
    
            if ($peminjaman) {
                if ($peminjaman->waktu_pengembalian === null) {
                    $waktuPeminjaman = new DateTime($peminjaman->waktu_peminjaman);
                    $waktuPengembalian = new DateTime($request->waktu_pengembalian);
                    
                    $range = date_diff($waktuPeminjaman, $waktuPengembalian);
                    if ($range->days > $peminjaman->durasi_peminjaman_in_days) {
                    $total_keterlambatan_in_days = $range->days - $peminjaman->durasi_peminjaman_in_days;
                    $total_denda = $total_keterlambatan_in_days * 1000;
                } else {
                    $total_keterlambatan_in_days = 0;
                    $total_denda = 0;
                }
    
                $peminjaman->update([
                    'waktu_pengembalian' => $request->waktu_pengembalian,
                    'total_keterlambatan_in_days' => $total_keterlambatan_in_days,
                    'total_denda' => $total_denda,
                ]);

                $buku = buku::find($peminjaman->buku_id);

                $buku->update([
                    'stok' => $buku->stok + 1,
                ]);

                DB::commit();
    
                return response()->json([
                    'status' => 'success',
                    'message' => 'Peminjaman berhasil diupdate',
                ], 200);
                }

                return response()->json([
                    'status' => 'error',
                    'message' => 'Peminjaman sudah dikembalikan',
                ], 400);

            } 
            return response()->json([
                'status' => 'error',
                'message' => 'Peminjaman tidak ditemukan',
            ], 404);
            
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
    public function destroy(peminjaman $peminjaman)
    {
        //
    }
}
