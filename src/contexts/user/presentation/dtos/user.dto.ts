import { User, UserRole } from '../../domain/entities/user.entity';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export class UserResponseDTO {
    static fromEntity(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            sellerProfile: user.sellerProfile
        };
    }
}