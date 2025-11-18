import { UserModel, IUser, IUserCreateData, UserRole, IUpdateSellerProfileData } from '../../domin/user.model';
import { IUserRepository } from '../../domin/i-user.repository';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export class UserMongoRepository implements IUserRepository {
    async create(data: IUserCreateData): Promise<IUser> {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.password, salt);

        const userDocument = new UserModel({
            name: data.name,
            email: data.email,
            role: data.role,
            passwordHash: passwordHash,
        });

        const savedUser = await userDocument.save();

        return savedUser.toObject() as IUser;
    }

    public async validateCredentials(email: string, password: string): Promise<IUser | null> {
        const userDocument = await UserModel.findOne({ email }).exec();

        if (!userDocument) {
            return null;
        }

        const isPasswordMatch = await bcrypt.compare(password, userDocument.passwordHash);

        if (!isPasswordMatch) {
            return null;
        }

        return userDocument.toObject() as IUser;
    }

    public async find(role?: UserRole): Promise<IUser[]> {
        const filter = role ? { role: role } : {};
        
        const userDocuments = await UserModel.find(filter).exec();

        return userDocuments.map(doc => doc.toObject() as IUser);
    }

    public async findById(id: string): Promise<IUser | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            
            const user = await UserModel.findById(id).exec();
            
            return user ? (user.toObject() as IUser) : null;
        } catch (error) {
            console.error(`[UserMongoRepository] Помилка при пошуку findById: ${id}`, error);
            return null;
        }
    }

    public async deleteById(id: string): Promise<IUser | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            
            const deletedUser = await UserModel.findByIdAndDelete(id).exec();
            
            return deletedUser ? (deletedUser.toObject() as IUser) : null;
        } catch (error) {
            console.error(`[UserMongoRepository] Помилка при видаленні deleteById: ${id}`, error);
            return null;
        }
    }
    
    public async findByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).exec();
        return user ? (user.toObject() as IUser) : null;
    }

    public async updateSellerProfile(userId: string, data: IUpdateSellerProfileData): Promise<IUser | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return null;
            }

            const updateData: { [key: string]: any } = {};
            
            for (const [key, value] of Object.entries(data)) {
                
                if (key === 'socialMedia') {
                
                    if (typeof value === 'object' && value !== null) {
                        if (value.instagram) updateData['sellerProfile.socialMedia.instagram'] = value.instagram;
                        if (value.facebook) updateData['sellerProfile.socialMedia.facebook'] = value.facebook;
                        if (value.youtube) updateData['sellerProfile.socialMedia.youtube'] = value.youtube;
                    }

                } else {
                    updateData[`sellerProfile.${key}`] = value;
                }
            }

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId, role: 'Seller' },
                { $set: updateData },
                { new: true }
            ).exec();

            return updatedUser ? (updatedUser.toObject() as IUser) : null;
        } catch (error) {
            console.error(`[UserMongoRepository] Помилка при оновленні updateSellerProfile: ${userId}`, error);
            return null;
        }
    }
}