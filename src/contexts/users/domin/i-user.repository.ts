import { IUpdateSellerProfileData, IUser, IUserCreateData, UserRole } from './user.model';

export interface IUserRepository {
    create(data: IUserCreateData): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    find(role?: UserRole): Promise<IUser[]>;
    validateCredentials(email: string, password: string): Promise<IUser | null>;
    deleteById(id: string): Promise<IUser | null>;
    updateSellerProfile(userId: string, data: IUpdateSellerProfileData): Promise<IUser | null>;
}