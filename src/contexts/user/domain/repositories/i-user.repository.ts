import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.type';

export interface PaginatedUsers {
    users: User[];
    total: number;
}

export interface IUserRepository {
    save(user: User): Promise<void>;
    find(role?: UserRole, page?: number, limit?: number): Promise<PaginatedUsers>;
    findById(userId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    deleteById(useIid: string): Promise<User | null>;
}