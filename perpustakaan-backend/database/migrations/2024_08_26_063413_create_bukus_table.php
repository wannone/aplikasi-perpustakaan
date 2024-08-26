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
        Schema::create('buku', function (Blueprint $table) {
            $table->bigIncrements('buku_id');
            $table->unsignedBigInteger('kategori_id');
            $table->string('nama', 255);
            $table->string('isbn', 255);
            $table->string('pengarang', 255);
            $table->text('sinopsis');
            $table->smallInteger('stok');
            $table->string('foto', 255);
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('kategori_id')->references('kategori_id')->on('kategori')->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buku');
    }
};
