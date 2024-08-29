export const DeleteBook = async(id : number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku/${id}`, {
            method: 'DELETE'
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