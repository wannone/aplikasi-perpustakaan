export const GetAllCategory = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/kategori`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error('Error updating book: ' + result.message);
        }
        
        return result.data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}