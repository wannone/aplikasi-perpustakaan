export const DeleteCategory = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/kategori/${id}?check=true`, {
            method: 'DELETE',
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error('Error deleting category: ' + result.message);
        }

        return result;
    } catch (error) {
        throw new Error('Error deleting category: ' + error);
    }
};