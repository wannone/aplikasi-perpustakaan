export const UpdateBook = async (id: string, data: FormData) => {
    try {
        //throw new Error(String(data.get('nama')));
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/buku/${id}?_method=PUT`, {
            method: 'POST',
            headers: {
                'accept': 'application/json', 
            },
        body: data,
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error('Error updating book: ' + result.message);
        }
        return result;
        
    } catch (error) {
        throw new Error('Error updating book: ' + error);
    }
}
