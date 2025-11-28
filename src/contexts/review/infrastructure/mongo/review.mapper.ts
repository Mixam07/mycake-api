import { PastryMapper } from '../../../pastry/infrastructure/mongo/pastry.mapper';
import { UserMapper } from '../../../user/infrastructure/mongo/user.mapper';
import { Review } from '../../domain/entities/review.entity';
import { ReviewDoc } from './review.schema';

export class ReviewMapper {
    static toDomain(doc: ReviewDoc): Review {
        const userEntity = (doc.user && typeof doc.user === 'object' && '_id' in doc.user)
            ? UserMapper.toDomain(doc.user as any)
            : null;

        const pastryEntity = (doc.pastry && typeof doc.pastry === 'object' && '_id' in doc.pastry)
            ? PastryMapper.toDomain(doc.pastry as any)
            : null;

        const confectionerEntity = (doc.confectioner && typeof doc.confectioner === 'object' && '_id' in doc.confectioner)
            ? UserMapper.toDomain(doc.confectioner as any)
            : null;

        return new Review(
            doc.id.toString(),
            doc.text,
            doc.rating,
            doc.userId,
            doc.pastryId,
            doc.confectionerId,
            userEntity,
            pastryEntity,
            confectionerEntity,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(review: Review): any {
        return {
            _id: review.id,
            text: review.text,
            rating: review.rating,
            userId: review.userId,
            pastryId: review.pastryId,
            confectionerId: review.confectionerId,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        };
    }
}