<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buku extends Model
{
    use HasFactory;

    protected $table = 'buku';
    protected $primaryKey = 'buku_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'kategori_id',
        'nama',
        'isbn',
        'pengarang',
        'sinopsis',
        'stok',
        'foto',
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function peminjaman()
    {
        return $this->hasMany(Peminjaman::class, 'buku_id');
    }
}
