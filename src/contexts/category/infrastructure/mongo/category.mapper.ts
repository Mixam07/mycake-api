import { Category } from '../../domain/entities/category.entity';
import { ISellerProfile } from '../../domain/entities/category.type';
import { CategoryDoc } from './category.schema';

export class CategoryMapper {
    static toDomain(doc: CategoryDoc): Category {
        return new Category(
            doc.id.toString(),
            doc.name,
            doc.slug,
            doc.pastries,
            doc.createdAt || new Date(),
            doc.updatedAt || new Date(),
        );
    }

    static toPersistence(category: Category): any {
        return {
            _id: category.id,
            name: category.name,
            slug: category.slug,
            pastries: category.pastries,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }
}