import { UserPostModel } from "../model/user";

export const UpdateUser = async (data: UserPostModel, id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama: data.nama,
                email: data.email,
                role_id: data.role_id
        })});
    } catch (error) {
        throw new Error('Error fetching data: ' + error);
    }
}