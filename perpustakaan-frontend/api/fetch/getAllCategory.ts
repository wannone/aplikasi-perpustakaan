export const GetAllCategory = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/kategori`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }
        
        return result.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}