export const updateCategory = async (id: string, nama: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/kategori/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nama }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}