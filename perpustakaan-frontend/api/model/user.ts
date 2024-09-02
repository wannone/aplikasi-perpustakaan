export type UserModel = {
    user_id: number;
    role: string;
    nama: string;
    email: string;
};

export type UserPostModel = {
    role_id: number;
    nama: string;
    email: string;
};

export type RoleModel = {
    role_id: number;
    nama: string;
}

export type RegisterModel = {
    nama: string;
    email: string;
    password: string;
    password_confirmation: string;
}