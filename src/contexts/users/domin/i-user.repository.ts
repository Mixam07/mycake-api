import { IUserCreateData } from '../infrastructure/persistence/user.mongo.repository';
import { IUpdateSellerProfileData, IUser, UserRole } from './user.model';

export interface IUserRepository {
    create(data: IUserCreateData): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    find(role?: UserRole): Promise<IUser[]>;
    validateCredentials(email: string, password: string): Promise<IUser | null>;
    deleteById(id: string): Promise<IUser | null>;
    updateSellerProfile(userId: string, data: IUpdateSellerProfileData): Promise<IUser | null>;
    updateAvatar(userId: string, avatarUrl: string): Promise<IUser | null>;
}