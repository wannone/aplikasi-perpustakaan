export type BookModel = {
    buku_id: number;
    nama: string;
    kategori: string;
    isbn: string;
    pengarang: string;
    sinopsis: string;
    stok: number;
    foto: string | null;
}

export type BookPostModel = {
    nama: string;
    kategori_id: number;
    isbn: string;
    pengarang: string;
    sinopsis: string;
    stok: number;
    foto: string;
}

export type onRentModel = {
    peminjaman_id: number;
    peminjam: string;
    petugas: string;
    buku: string;
    isbn: string;
    pengarang: string;
    waktu_peminjaman: string;
    durasi_peminjaman_in_days: number;
}

export type RentHistoryModel = {
    peminjaman_id: number;
    peminjam: string;
    petugas: string;
    buku: string;
    waktu_peminjaman: string;
    durasi_peminjaman_in_days: number;
    waktu_pengembalian: string;
    total_keterlambatan_in_days: number;
    total_denda: number;
}