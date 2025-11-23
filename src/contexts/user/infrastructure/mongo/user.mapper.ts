import { ISellerProfile, User } from '../../domain/entities/user.entity';
import { UserDoc } from './user.schema';

export class UserMapper {
    static toDomain(doc: UserDoc): User {
        return new User(
            doc.id.toString(),
            doc.name,
            doc.email,
            doc.role as 'Buyer' | 'Seller',
            doc.avatarUrl,
            doc.sellerProfile as ISellerProfile
        );
    }

    static toPersistence(user: User): any {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            sellerProfile: user.sellerProfile
        };
    }
}