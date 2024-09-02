export const UpdateReturn = async (id: number, token: string) => {
    try {
        const currentDate = new Date().toLocaleDateString('en-CA');

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/pengembalian/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                waktu_pengembalian: currentDate
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}