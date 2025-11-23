import { ISellerProfile, User } from '../entities/user.entity';

export interface IMeRepository {
    updateSellerProfile(userId: string, data: ISellerProfile): Promise<User | null>;
}