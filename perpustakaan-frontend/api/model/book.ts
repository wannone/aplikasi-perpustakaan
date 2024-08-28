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