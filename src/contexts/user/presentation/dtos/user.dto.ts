import { User } from '../../domain/entities/user.entity';

export class UserResponseDTO {
    static fromEntity(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            sellerProfile: user.sellerProfile,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static fromEntities(users: User[]) {
        return users.map(user => UserResponseDTO.fromEntity(user));
    }
}