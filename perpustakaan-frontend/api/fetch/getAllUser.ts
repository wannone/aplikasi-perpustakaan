export const GetAllUser = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/user`);
        const data = await response.json();

        return data.data;
    } catch (error) {
        throw new Error("Error fetching user: " + error);
    }
}