<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\BukuController;
use App\Http\Controllers\API\KategoriController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RolesController;
use App\Http\Controllers\API\PeminjamanController;

Route::middleware('auth:api')->get('/auth', function (Request $request) {
    return $request->user();
});

Route::get('/buku', [BukuController::class, 'index']);

Route::get('/buku/{id}', [BukuController::class, 'show']);

Route::put('/buku/{id}', [BukuController::class, 'update']);

Route::post('/buku', [BukuController::class, 'store']);

Route::delete('/buku/{id}', [BukuController::class, 'destroy']);

Route::get('/kategori', [KategoriController::class, 'index']);

Route::get('/kategori/{id}', [KategoriController::class, 'show']);

Route::put('/kategori/{id}', [KategoriController::class, 'update']);

Route::post('/kategori', [KategoriController::class, 'store']);

Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

Route::get('/user', [UserController::class, 'index']);

Route::get('/user/{id}', [UserController::class, 'show']);

Route::post('/user/register', [UserController::class, 'register']);

Route::post('/user/login', [UserController::class, 'login']);

Route::post('/user/logout', [UserController::class, 'logout']);

Route::put('/user/{id}', [UserController::class, 'update']);

Route::delete('/user/{id}', [UserController::class, 'destroy']);

Route::get('/roles', [RolesController::class, 'index']);

Route::get('/peminjaman', [PeminjamanController::class, 'index']);

Route::get('/peminjaman/onRent', [PeminjamanController::class, 'showOnRent']);

Route::get('/peminjaman/peminjam/{id}', [PeminjamanController::class, 'showByPeminjam']);

Route::get('/peminjaman/petugas/{id}', [PeminjamanController::class, 'showByPetugas']);

Route::get('peminjaman/{id}', [PeminjamanController::class, 'show']);

Route::post('/peminjaman', [PeminjamanController::class, 'store']);

Route::put('/peminjaman/{id}', [PeminjamanController::class, 'update']);