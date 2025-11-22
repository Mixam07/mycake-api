import { UserRole } from '../../../user/domain/entities/user.entity';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginDto {
    email: string;
    password: string;
}