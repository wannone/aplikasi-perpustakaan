export const DeleteBook = async(id : number, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
        }    }
}