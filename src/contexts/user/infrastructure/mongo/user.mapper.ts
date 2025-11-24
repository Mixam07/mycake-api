import { User } from '../../domain/entities/user.entity';
import { ISellerProfile } from '../../domain/entities/user.type';
import { UserDoc } from './user.schema';

export class UserMapper {
    static toDomain(doc: UserDoc): User {
        const sellerProfile = this.mapSellerProfile(doc);

        return new User(
            doc.id.toString(),
            doc.name,
            doc.email,
            doc.role as 'Buyer' | 'Seller',
            doc.avatarUrl,
            sellerProfile,
            doc.pastries,
            doc.createdAt || new Date(),
            doc.updatedAt || new Date(),
        );
    }

    static toPersistence(user: User): any {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            sellerProfile: user.sellerProfile,
            pastries: user.pastries,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    private static mapSellerProfile(doc: UserDoc): ISellerProfile | undefined {
        if (!doc.sellerProfile || doc.role !== 'Seller') {
            return undefined;
        }

        const profile = doc.sellerProfile as ISellerProfile;

        return {
            description: profile.description,
            address: profile.address,
            phone: profile.phone,
            deliveryInfo: profile.deliveryInfo,
            paymentInfo: profile.paymentInfo,
            socialMedia: profile.socialMedia ? {
                instagram: profile.socialMedia.instagram,
                facebook: profile.socialMedia.facebook,
                youtube: profile.socialMedia.youtube,
            } : undefined
        };
    }
}