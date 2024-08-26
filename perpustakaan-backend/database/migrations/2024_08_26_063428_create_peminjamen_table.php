<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->bigIncrements('peminjaman_id');
            $table->unsignedBigInteger('peminjam_user_id');
            $table->unsignedBigInteger('petugas_user_id');
            $table->unsignedBigInteger('buku_id');
            $table->timestamp('waktu_peminjaman');
            $table->smallInteger('durasi_peminjaman_in_days');
            $table->timestamp('waktu_pengembalian')->nullable();
            $table->smallInteger('total_keterlambatan_in_days')->nullable();
            $table->float('total_denda')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('peminjam_user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('petugas_user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('buku_id')->references('buku_id')->on('buku')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamen');
    }
};
