export const PostBook = async (data: FormData, token: string) => {
    try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
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