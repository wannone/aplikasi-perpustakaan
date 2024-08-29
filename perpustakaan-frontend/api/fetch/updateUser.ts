import { UserPostModel } from "../model/user";

export const UpdateUser = async (data: UserPostModel, id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/user/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama: data.nama,
                email: data.email,
                role_id: data.role_id
        })});

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }
        
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}