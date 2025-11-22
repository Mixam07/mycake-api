import { Auth } from '../../domain/entities/auth.entity';
import { AuthDoc } from './auth.schema';

export class AuthMapper {
    static toDomain(doc: AuthDoc): Auth {
        return new Auth(
            doc._id,
            doc.email,
            doc.passwordHash
        );
    }

    static toPersistence(entity: Auth): any {
        return {
            _id: entity.id,
            email: entity.email,
            passwordHash: entity.passwordHash,
        };
    }
}