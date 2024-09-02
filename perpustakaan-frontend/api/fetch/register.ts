import { RegisterModel } from "../model/user";

export const Register = async (data: RegisterModel) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/register`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nama: data.nama,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                role_id: 3
            }),
        });

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