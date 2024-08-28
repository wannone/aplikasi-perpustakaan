export const DeleteCategory = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/kategori/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
};