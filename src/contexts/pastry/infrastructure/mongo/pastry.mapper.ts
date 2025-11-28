import { CategoryMapper } from '../../../category/infrastructure/mongo/category.mapper';
import { UserMapper } from '../../../user/infrastructure/mongo/user.mapper';
import { Pastry } from '../../domain/entities/pastry.entity';
import { PastryDoc } from './pastry.schema';

export class PastryMapper {
    static toDomain(doc: PastryDoc): Pastry {
        const categoryEntity = (doc.category && typeof doc.category === 'object' && '_id' in doc.category)
            ? CategoryMapper.toDomain(doc.category as any)
            : null;

        const confectionerEntity = (doc.confectioner && typeof doc.confectioner === 'object' && '_id' in doc.confectioner)
            ? UserMapper.toDomain(doc.confectioner as any)
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
            doc.categoryId,
            doc.confectionerId,
            categoryEntity,
            confectionerEntity,
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
            categoryId: entity.categoryId,
            confectionerId: entity.confectionerId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}