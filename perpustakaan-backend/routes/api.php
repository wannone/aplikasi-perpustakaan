<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\BukuController;
use App\Http\Controllers\API\KategoriController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RolesController;
use App\Http\Controllers\API\PeminjamanController;
use App\Http\Middleware\AdminAuth;
use App\Http\Middleware\PetugasAuth;

Route::middleware('auth:api')->get('/auth', function (Request $request) {
    return $request->user();
});

Route::post('/user/register', [UserController::class, 'register']);

Route::post('/user/login', [UserController::class, 'login']);

Route::post('/user/logout', [UserController::class, 'logout']);


Route::middleware(AdminAuth::class)->group(
    function () {
        Route::get('/user', [UserController::class, 'index']);
        Route::get('/user/{id}', [UserController::class, 'show']);
        Route::post('/user/{id}', [UserController::class, 'update']);
        Route::delete('/user/{id}', [UserController::class, 'destroy']);

        Route::get('/roles', [RolesController::class, 'index']);

    }
);

Route::middleware(['auth:api', PetugasAuth::class])->group(
    function () {
        Route::post('/buku/{id}', [BukuController::class, 'update']);
        Route::post('/buku', [BukuController::class, 'store']);
        Route::delete('/buku/{id}', [BukuController::class, 'destroy']);

        Route::post('/kategori/{id}', [KategoriController::class, 'update']);
        Route::post('/kategori', [KategoriController::class, 'store']);
        Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

        Route::get('/peminjaman', [PeminjamanController::class, 'index']);
        Route::post('/peminjaman', [PeminjamanController::class, 'store']);
        Route::post('/pengembalian/{id}', [PeminjamanController::class, 'update']);

    }
);

Route::get('/buku', [BukuController::class, 'index']);

Route::get('/buku/{id}', [BukuController::class, 'show']);

Route::get('/kategori', [KategoriController::class, 'index']);

Route::get('/kategori/{id}', [KategoriController::class, 'show']);

Route::get('/peminjaman/onRent', [PeminjamanController::class, 'showOnRent']);

Route::get('/peminjaman/peminjam/{id}', [PeminjamanController::class, 'showByPeminjam']);

Route::get('/peminjaman/petugas/{id}', [PeminjamanController::class, 'showByPetugas']);

Route::get('peminjaman/{id}', [PeminjamanController::class, 'show']);