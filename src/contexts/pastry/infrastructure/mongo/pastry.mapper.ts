import { Pastry } from '../../domain/entities/pastry.entity';
import { PastryDoc } from './pastry.schema';

export class PastryMapper {
    static toDomain(doc: PastryDoc): Pastry {
        return new Pastry(
            doc._id,
            doc.category?._id,
            doc.category?.name,
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
            doc.confectionerId,
            doc.createdAt || new Date(),
            doc.updatedAt || new Date(),
        );
    }

    static toPersistence(entity: Pastry): any {
        return {
            _id: entity.id,
            categoryId: entity.categoryId,
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
            confectionerId: entity.confectionerId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}