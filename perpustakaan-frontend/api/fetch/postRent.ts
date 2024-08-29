export const PostRent = async (email: string, bukuId: string, duration: string) => {
    try {
        const currentDate = new Date().toLocaleDateString('en-CA');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/peminjaman`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                peminjam_email: email,
                petugas_user_id: 5,
                buku_id: bukuId,
                waktu_peminjaman: currentDate,
                durasi_peminjaman_in_days: duration,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        return result

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}