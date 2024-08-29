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
            throw new Error('Error updating book: ' + result.message);
        }
        return result;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}