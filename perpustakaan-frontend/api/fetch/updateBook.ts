export const UpdateBook = async (id: string, data: FormData, token: string) => {
    try {
        //throw new Error(String(data.get('nama')));
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        body: data,
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
