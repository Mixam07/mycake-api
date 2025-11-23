import { UserRole } from "../../../user/domain/entities/user.type";

export interface CreateAuthDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginDto {
    email: string;
    password: string;
}