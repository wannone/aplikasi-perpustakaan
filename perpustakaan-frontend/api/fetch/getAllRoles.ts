export const GetAllRoles = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/roles`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error("Error fetching role: " + error);
    }
}