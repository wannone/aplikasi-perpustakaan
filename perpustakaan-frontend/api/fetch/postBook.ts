import { BookPost } from "../model/book";

export const PostBook = async (data: BookPost) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}