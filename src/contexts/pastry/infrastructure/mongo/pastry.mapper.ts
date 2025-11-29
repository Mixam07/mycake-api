import { CategoryMapper } from '../../../category/infrastructure/mongo/category.mapper';
import { UserMapper } from '../../../user/infrastructure/mongo/user.mapper';
import { Pastry } from '../../domain/entities/pastry.entity';
import { PastryDoc } from './pastry.schema';

export class PastryMapper {
    static toDomain(doc: PastryDoc): Pastry {
        const categoryEntity = (doc.category && typeof doc.category === 'object' && '_id' in doc.category)
            ? CategoryMapper.toDomain(doc.category as any)
            : null;

        const sellerEntity = (doc.seller && typeof doc.seller === 'object' && '_id' in doc.seller)
            ? UserMapper.toDomain(doc.seller as any)
            : null;

        return new Pastry(
            doc._id,
            doc.status,
            doc.images,
            doc.name,
            doc.price,
            doc.description,
            doc.tags,
            doc.weight,
            doc.fillings,
            doc.additionalServices,
            doc.minWeight,
            doc.maxWeight,
            doc.reviewIds,
            doc.categoryId,
            doc.sellerId,
            categoryEntity,
            sellerEntity,
            doc.createdAt || new Date(),
            doc.updatedAt || new Date(),
        );
    }

    static toPersistence(entity: Pastry): any {
        return {
            _id: entity.id,
            status: entity.status,
            images: entity.images,
            name: entity.name,
            price: entity.price,
            description: entity.description,
            tags: entity.tags,
            weight: entity.weight,
            fillings: entity.fillings,
            additionalServices: entity.additionalServices,
            minWeight: entity.minWeight,
            maxWeight: entity.maxWeight,
            reviewIds: entity.reviewIds,
            categoryId: entity.categoryId,
            sellerId: entity.sellerId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}