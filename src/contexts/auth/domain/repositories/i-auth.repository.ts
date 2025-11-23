import { Auth } from '../entities/auth.entity';

export interface IAuthRepository {
    save(auth: Auth): Promise<void>;
    findByEmail(email: string): Promise<Auth | null>;
    deleteById(userId: string): Promise<Auth | null>;
}