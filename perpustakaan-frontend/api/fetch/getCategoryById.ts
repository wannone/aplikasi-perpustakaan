export const GetCategoryById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/kategori/${id}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}