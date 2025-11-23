import mongoose from 'mongoose';
import { logger } from '../../../../shared/infrastructure/logging/logger.service';
import { ISellerProfile, User } from '../../domain/entities/user.entity';
import { IMeRepository } from '../../domain/repositories/i-me.repository';
import { UserModel } from '../mongo/user.schema';
import { UserMapper } from '../mongo/user.mapper';

export class MeMongoRepository implements IMeRepository {
    async updateSellerProfile(userId: string, data: ISellerProfile): Promise<User | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return null;
            }

            const updateData: { [key: string]: any } = {};

            const keys = Object.keys(data) as Array<keyof ISellerProfile>;

            for (const key of keys) {
                const value = data[key];

                if (value === undefined) continue;

                if (key === 'socialMedia' && typeof value === 'object' && value !== null) {
                    const socialKeys = Object.keys(value) as Array<keyof typeof value>;
                    
                    for (const sKey of socialKeys) {
                        const sVal = value[sKey];
                        if (sVal !== undefined) {
                            updateData[`sellerProfile.socialMedia.${sKey}`] = sVal;
                        }
                    }
                } else {
                    updateData[`sellerProfile.${key}`] = value;
                }
            }

            const updatedDoc = await UserModel.findOneAndUpdate(
                { _id: userId, role: 'Seller' },
                { $set: updateData },
                { new: true }
            ).exec();

            return updatedDoc ? UserMapper.toDomain(updatedDoc) : null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
    
            logger.error(`[UserMongoRepository] Помилка при оновленні updateSellerProfile: ${userId}. Деталі: ${errorMessage}`);
            return null;
        }
    }
}