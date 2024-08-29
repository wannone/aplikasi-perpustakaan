export const PostBook = async (data: FormData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku`, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
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