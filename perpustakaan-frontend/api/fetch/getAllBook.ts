export const GetAllBooks = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}