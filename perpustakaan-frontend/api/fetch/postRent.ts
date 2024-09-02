import { getAuth } from "./getAuth";

export const PostRent = async (email: string, bukuId: string, duration: string, token: string) => {
    try {
        const currentDate = new Date().toLocaleDateString('en-CA');
        const userLogin = await getAuth(token);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/peminjaman`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`            
            },
            body: JSON.stringify({
                peminjam_email: email,
                petugas_user_id: userLogin.user_id,
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