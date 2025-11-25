import { Category } from '../../domain/entities/category.entity';

export interface CreateCategoryDto {
    name: string
}

export class CategoryResponseDTO {
    static fromEntity(category: Category) {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }

    static fromEntities(categories: Category[]) {
        return categories.map(category => CategoryResponseDTO.fromEntity(category));
    }
}