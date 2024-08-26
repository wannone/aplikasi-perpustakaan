<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\BukuController;
use App\Http\Controllers\API\KategoriController;
use App\Http\Controllers\API\UserController;

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

Route::post('/user/register', [UserController::class, 'register']);

Route::post('/user/login', [UserController::class, 'login']);

Route::post('/user/logout', [UserController::class, 'logout']);

Route::put('/user/{id}', [UserController::class, 'update']);